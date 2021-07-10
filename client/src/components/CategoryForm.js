import React, {useState, useEffect} from 'react';
import moment from 'moment';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import categoryService from '../services/category';
import {swalDeleteForm, swalError, swalInfo, swalSuccess} from "../utils/swal";
import Swal from "sweetalert2";
import SelectSearch, {fuzzySearch} from 'react-select-search';
import 'react-select-search/style.css';

/* import ReactDOM from 'react-dom'

import DropdownTreeSelect from 'react-dropdown-tree-select' */
import 'react-dropdown-tree-select/dist/styles.css'

function CategoryForm(props) {

    console.log('props : ', props);

    const currentDateTime = moment();
    const [label, setLabel] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [parentCategoryId, setParentCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [startedAt, setStartedAt] = useState(currentDateTime);
    const [finishedAt, setFinishedAt] = useState(currentDateTime);
    const [categories, setCategories] = useState([]);

    const reloadPage = () => {
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
    

    useEffect(() => {       

        categoryService.getAllFlat("")
            .then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                setCategories(result.data);
                if (props.category) {
                    console.log(props.category);
                    setLabel(props.category.label.split('|')[0]);
                    setParentCategoryId(props.category.parentCategoryId)
                    /* setCategoryId(props.category.categoryId);
                    setDescription(props.category.description);
                    setStartedAt(moment(props.category.start).format("YYYY-MM-DDTHH:mm"));
                    setFinishedAt(moment(props.category.end).format("YYYY-MM-DDTHH:mm")); */
                }
            });
    }, []);

    const handleSubmit = async e => {
        console.log('payload : ', {label, parentCategoryId});
        e.preventDefault();        

        if (!props.category) {
            await categoryService.add(label, parentCategoryId).then(result => {
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                Swal.close();
                swalSuccess('Category added successfully!');
                clear();
                //props.reloadTasks();
                props.onClose();
                reloadPage();
            });
        } else {
            await categoryService.update(props.category._id, label,
                parentCategoryId).then(result => {
                    console.log('result : ', result);
                if (result.error) {
                    swalError(result.error);
                    return;
                }

                Swal.close();
                swalSuccess('Category updated successfully!');
                clear();
                //props.reloadTasks();
                props.onClose();
                reloadPage();
            });
        }
    }

    const handleDelete = e => {
        swalDeleteForm(async () => {
            await categoryService.delete(props.category._id)
                .then(result => {
                    if (result.error) {
                        swalError(result.error);
                        return;
                    }

                    Swal.close();
                    swalSuccess('Category deleted successfully!');
                    clear();
                    //props.reloadTasks();
                    props.onClose();
                });
        });
    }

    const clear = () => {
        setLabel('');
        setDescription('');
        setCategoryId('');
        setParentCategoryId('');
        const currentDateTime = moment().format("YYYY-MM-DDThh:mm");
        setStartedAt(currentDateTime);
        setFinishedAt(currentDateTime);
    }
   

    return (
       
        <Rodal visible={true}
               onClose={() => {
                   clear();
                   props.onClose();
               }}
               closeOnEsc={false}
               closeMaskOnClick={false}
               customStyles={{width: '50%', height: '70%', overflow: 'auto'}}>
            <div className="container-fluid text-center">
                <form onSubmit={handleSubmit}>
                    <h4 className="m-4">{props.category && 'Update Category' || 'Create Category'}</h4>
                    {/*<div className="row">*/}
                    {/*    <div className="col text-left">*/}
                    {/*        <label><i>You are {props.category && 'updating' || 'adding'} this Category*/}
                    {/*            in <strong>{props.selectedCategory.label} </strong>category.</i></label>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <div className="row">
                        <div className="col text-left">
                            <div className="form-group">
                                <label htmlFor="txtLabel">Category label</label>
                                <input type="text" className="form-control"
                                       placeholder="Label or Title..." required="required"
                                       id="txtLabel"
                                       value={label} onChange={e => setLabel(e.target.value)}/>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col text-left">
                            <div className="form-group">
                                <label htmlFor="txtLabel">Category</label>
                                {/* <DropdownTreeSelect data={categories} onChange={onChange} onAction={onAction} onNodeToggle={onNodeToggle} 
                                keepTreeOnSearch={true} mode="radioSelect" keepOpenOnSelect={true}/> */}

                                <SelectSearch
                                    value={parentCategoryId}
                                    //defaultValue={{value:props.category.parentCategoryId, label: '9999'}}
                                    onChange={setParentCategoryId}
                                    emptyMessage="Not found"
                                    placeholder="Select category"
                                    search
                                    filterOptions={fuzzySearch}
                                    options={categories}
                                    style={{width: '100%'}}
                                />
                            </div>
                        </div>
                    </div>              
              
                    <div className="row">
                        <div className="col">
                            <button
                                type="button"
                                className="btn btn-secondary m-1"
                                onClick={props.onClose}>Close
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary m-1"
                                onClick={handleSubmit}>Submit
                            </button>
                            {
                                props.category &&
                                <button
                                    type="button"
                                    className="btn btn-danger m-1"
                                    onClick={handleDelete}>Delete
                                </button>
                            }
                        </div>
                    </div>
                </form>
            </div>
        </Rodal>
    );
}

export default CategoryForm;