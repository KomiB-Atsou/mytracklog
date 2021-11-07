import React from 'react';
import moment from 'moment';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
/*import NoCategorySelected from "./NoCategorySelected";
import taskService from '../services/task';*/

function CalendarView(props) {

   /*  const [start, setStart] = useState(Date.now());
    const [end, setEnd] = useState(Date.now()); */
    moment.locale("en", {
        week: {
            dow: 1
        }
    })
    const localizer = momentLocalizer(moment);

    const handleSelect = ({ start, end }) => {
    }

    const onNavigate = (date, view) => {
        let start, end;
      
        if (view === 'month') {
          start = moment(date).startOf('month').startOf('week')
          console.log(start)
          end = moment(date).endOf('month').endOf('week')
        }
        console.log(start, end);
      
        return console.log({ start, end });
      }

    const handleSelectEvent = task => {
        console.log('see task selected : ', task)
        props.viewTaskDetails(task);
    }

    return (
        <div style={{height: '90vh'}}>
            <Calendar
                popup
                selectable
                localizer={localizer}
                events={props.tasks}
                onSelectSlot={handleSelect}
                onSelectEvent={handleSelectEvent}
                onNavigate={onNavigate}
            />
        </div>
    );
}

export default CalendarView;