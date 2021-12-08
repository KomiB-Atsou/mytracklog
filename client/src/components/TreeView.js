import React, {useState, useEffect} from 'react';
import categoryService from '../services/category';
import taskService from '../services/task';
import { AppBar, Typography, Toolbar, Avatar, Button } from '@material-ui/core';
import {swalCategory, swalDeleteCategory, swalError, swalLoading, swalSuccess} from "../utils/swal";
import Swal from "sweetalert2";
/* import CalendarView from "./CalendarView";
import Header from "./Header"; */
import Category from "./Category";
import { Link } from 'react-router-dom';
import CategoryForm from './CategoryForm';
import _ from "lodash";
import moment from 'moment';

function TreeView(props) {

    const [showCategoryDetailsPopup, setShowCategoryDetailsPopup] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedUpdateCategory, setSelectedUpdateCategory] = useState(null);
    const [currentCategoryParent, setCurrentCategoryParent] = useState('');

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showCategoryUpdateModal, setShowCategoryUpdateModal] = useState(false);
    
    const [totalDuration, setTotalDuration] = useState(0);
    const [tasks, setTasks] = useState([]);

    

    useEffect(() => {
        reloadLibs();
        //reloadTasks();
    }, []);

    const handleCreateCategory = e => {
        e.preventDefault();
        setShowCategoryModal(true);
       
    }

    const reloadPage = () => {
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    const reloadLibs = () => {
        setTimeout(() => {
            if (document.querySelector(`script[src*="/js/script.js"]`))
                document.querySelector(`script[src*="/js/script.js"]`).remove();

            let js = document.createElement("script");
            js.src = "/js/script.js";
            js.type = "text/javascript";
            document.getElementsByTagName('body')[0].appendChild(js);
        }, 2000);
    }

    const reloadTasks = async () => {
        await taskService.getAll(selectedCategory._id)
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                setTotalDuration(result.data.duration);

                let f = Array.from(result.data.tasks);
                let groups = _.groupBy(result.data.tasks, obj => moment(obj.start).startOf('day').format());
                for (const [key, value] of Object.entries(groups)) {
                    f.push({
                        _id: value._id,
                        categoryId: value.categoryId,
                        title: `Total ${getHoursMinutesFormat(value.reduce((a, b) => a + b.duration, 0))}`,
                        start: moment(key).toDate(),
                        end: moment(key).toDate()
                    });
                }
                
                f = f.map(x => {
                    return {
                        ...x,
                        start: moment(x.start).toDate(),
                        end: moment(x.end).toDate()
                    };
                });

                setTasks(f);
            });
    } 

    const handleCreate = (e, currentCategory) => {
        e.preventDefault();

        swalCategory('', currentCategory.label, async label => {
            swalLoading();
            await categoryService.add(label, currentCategory._id)
                .then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                Swal.close();
                swalSuccess('Category added successfully!');
                reloadPage();
            });
        });
    }

    const handleCategoryDetails = (e, currentCategory) => {
        e.preventDefault();
        setSelectedCategory(currentCategory);
        setShowCategoryDetailsPopup(true);
    }

    const handleCreateRoot = e => {
        e.preventDefault();

        swalCategory('', '', label => {
            swalLoading();
            categoryService.add(label, '').then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                Swal.close();
                swalSuccess('Category added successfully!');
                reloadPage();
            });
        });
    }

    const handleUpdate = (e, currentCategory) => {
        e.preventDefault();
        setSelectedCategory(currentCategory);
        //setCurrentCategoryParent(currentCategory.parentCategoryId)
        setShowCategoryUpdateModal(true);

        /* swalCategory(currentCategory.label, '', async label => {
            swalLoading();
            await categoryService.update(currentCategory._id, label)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    Swal.close();
                    swalSuccess('Category updated successfully!');
                    reloadPage();
                });
        }); */
    }

    const handleDelete = (e, currentCategory) => {
        swalDeleteCategory(async () => {
            await categoryService.delete(currentCategory._id)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    Swal.close();
                    swalSuccess('Category deleted successfully!');
                    reloadPage();
                });
        });
    }

    const handleSelect = (e, currentCategory) => {
        console.log('select one category');
        props.setSelectedCategory(currentCategory);
    }

    const renderTree = arr => {
        return arr.map(node => {
            if (node.children.length > 0) {
                return <li key={node._id}>
                    <a onClick={e => handleSelect(e, node)}><i className="far fa-folder"></i>{node.label}</a>
                    <i className="fa fa-eye" onClick={e => handleCategoryDetails(e, node)} title="View details"></i>
                    <i className="fa fa-plus" onClick={e => handleCreate(e, node)} title="Add sub category"></i>
                    <i className="fa fa-pencil-alt" onClick={e => handleUpdate(e, node)} title="Edit this category"></i>
                    <i className="fa fa-trash" onClick={e => handleDelete(e, node)} title="Delete this category"></i>
                    <ul>
                        {renderTree(node.children)}
                    </ul>
                </li>;
            } else {
                return <li key={node._id}>
                    <a onClick={e => handleSelect(e, node)}>{node.label}</a>
                    <i className="fa fa-eye" onClick={e => handleCategoryDetails(e, node)} title="View details"></i>
                    <i className="fa fa-plus" onClick={e => handleCreate(e, node)} title="Add sub category"></i>
                    <i className="fa fa-pencil-alt" onClick={e => handleUpdate(e, node)} title="Edit this category"></i>
                    <i className="fa fa-trash" onClick={e => handleDelete(e, node)} title="Delete this category"></i>
                </li>
            }
        });
    }

    const getHoursMinutesFormat = minutes => moment.utc(moment.duration(minutes*60, "seconds").asMilliseconds()).format("HH:mm");


    return (
        <div>
            {
                showCategoryModal &&
                <CategoryForm
                    task={selectedCategory}
                    onClose={() => {setSelectedCategory(null); setShowCategoryModal(false);}}
                    reloadCategorys={reloadTasks}
                     />
            }
            {
                showCategoryUpdateModal &&
                <CategoryForm
                    category={selectedCategory}
                    onClose={() => {setSelectedUpdateCategory(null); setShowCategoryUpdateModal(false);}}
                    reloadCategorys={reloadTasks}
                     />
            }
            {selectedCategory && showCategoryDetailsPopup && <Category category={selectedCategory} onClose={() => {setSelectedCategory(null); setShowCategoryDetailsPopup(false);}} />}
            <div className="row">
                <div className="col text-left">
                    <a href="#" onClick={e => handleCreateRoot(e)} className="btn-purple">
                        <i
                            className="fa fa-plus-circle"
                            style={{fontSize: '20px', marginRight: '8px'}}
                        ></i>
                        Root category
                    </a>
                    {/* <Button component={Link} to="/categoryAdd" variant="contained" color="primary">Add new category</Button> */}
                </div>
                <div className="col text-right" style={{marginRight: '108px'}}>
                    <a href="#" onClick={e => handleCreateCategory(e)} className="btn-purple">
                        <i
                            className="fa fa-plus-circle"
                            style={{fontSize: '20px', marginRight: '8px'}}
                        ></i>
                        Category
                    </a>
                    {/* <Button component={Link} to="/categoryAdd" variant="contained" color="primary">Add new category</Button> */}
                </div>
            </div>
            <div className="row mt-10">
                <div className="col">
                    <ul id="treeview" className="jslists">
                        {renderTree(props.data)}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default TreeView;