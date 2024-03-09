(function () {
const calendaroffcanvas = new bootstrap.Offcanvas('#calendar-add_edit_event');
const calendarmodal = new bootstrap.Modal('#calendar-modal');
var calendevent = '';

var date = new Date();
var d = date.getDate();
var m = date.getMonth();
var y = date.getFullYear();

document.addEventListener('DOMContentLoaded', function() {
    var calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        resources: [
            { id: '1', title: 'Campo 1'},
            { id: '2', title: 'Campo 2' },
            { id: '3', title: 'Campo 3' },
            { id: '4', title: 'Campo 4' },
            { id: '5', title: 'Campo 5' },
            { id: '6', title: 'Campo 6' },
            { id: '7', title: 'Campo 7' },
            { id: '8', title: 'Campo 8' },
            { id: '9', title: 'Campo 9' }
        ],
        slotMinTime: "08:00:00",
        slotMaxTime: "23:00:00",
        slotLabelFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false
        },
        allDaySlot: false,
        initialView: 'resourceTimeGridDay',
        themeSystem: 'bootstrap',
        initialDate: new Date(),
        slotDuration: '00:30:00',
        slotLabelInterval: '00:30:00',
        navLinks: true,
        height: 'auto',
        droppable: true,
        selectable: true,
        selectMirror: true,
        editable: true,
        dayMaxEvents: true,
        handleWindowResize: true,
        select: function (info) {
            var sdt = new Date(info.start);
            var edt = new Date(info.end);
            var id = info.resource._resource.id;
            document.getElementById('pc-e-sdate').value = sdt;
            document.getElementById('pc-e-edate').value = edt;
            document.getElementById('pc-e-id').value = id;
            calendaroffcanvas.show();
            calendar.unselect();
        },
        eventClick: function (info) {
            calendevent = info.event;
            var clickedevent = info.event;
            var e_title = clickedevent.title === undefined ? '' : clickedevent.title;
            var e_desc = clickedevent.extendedProps.description === undefined ? '' : clickedevent.extendedProps.description;
            var e_date_start = clickedevent.start === null ? '' : dateformat(clickedevent.start);
            var e_date_end = clickedevent.end === null ? '' : " <i class='text-sm'>to</i> " + dateformat(clickedevent.end);
            e_date_end = clickedevent.end === null ? '' : e_date_end;
            var e_venue = clickedevent.extendedProps.description === undefined ? '' : clickedevent.extendedProps.venue;

            document.querySelector('.calendar-modal-title').innerHTML = e_title;
            document.querySelector('.pc-event-title').innerHTML = e_title;
            document.querySelector('.pc-event-description').innerHTML = e_desc;
            document.querySelector('.pc-event-date').innerHTML = e_date_start + e_date_end;
            document.querySelector('.pc-event-venue').innerHTML = e_venue;

            calendarmodal.show();
        }
    });

    calendar.render();

document.addEventListener('DOMContentLoaded', function () {
  var calbtn = document.querySelectorAll('.fc-toolbar-chunk');
  for (var t = 0; t < calbtn.length; t++) {
    var c = calbtn[t];
    c.children[0].classList.remove('btn-group');
    c.children[0].classList.add('d-inline-flex');
  }
});

var pc_event_remove = document.querySelector('#pc_event_remove');
if (pc_event_remove) {
  pc_event_remove.addEventListener('click', function () {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-light-success',
        cancelButton: 'btn btn-light-danger'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: 'you want to delete this event?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      })
      .then((result) => {
        if (result.isConfirmed) {
          calendevent.remove();
          calendarmodal.hide();
          swalWithBootstrapButtons.fire('Deleted!', 'Your Event has been deleted.', 'success');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire('Cancelled', 'Your Event data is safe.', 'error');
        }
      });
  });
}

var pc_event_add = document.querySelector('#pc_event_add');
if (pc_event_add) {
  pc_event_add.addEventListener('click', function () {
    var day = true;
    var end = null;
    var e_date_start = document.getElementById('pc-e-sdate').value === null ? '' : document.getElementById('pc-e-sdate').value;
    var e_date_end = document.getElementById('pc-e-edate').value === null ? '' : document.getElementById('pc-e-edate').value;
    console.log(document.getElementById('pc-e-id').value.toString(), new Date(e_date_start), document.getElementById('pc-e-edate').value);
    calendar.addEvent({
      title: document.getElementById('pc-e-title').value,
      start: new Date(e_date_start),
      end: new Date(e_date_end),
      allDay: false,
      description: document.getElementById('pc-e-description').value,
      venue: document.getElementById('pc-e-venue').value,
      className: document.getElementById('pc-e-type').value,
      resourceId: document.getElementById('pc-e-id').value.toString()
    });
    if (pc_event_add.getAttribute('data-pc-action') == 'add') {
      Swal.fire({
        customClass: {
          confirmButton: 'btn btn-light-primary'
        },
        buttonsStyling: false,
        icon: 'success',
        title: 'Success',
        text: 'Event added successfully'
      });
    } else {
      calendevent.remove();
      document.getElementById('pc-e-btn-text').innerHTML = '<i class="align-text-bottom me-1 ti ti-calendar-plus"></i> Add';
      document.querySelector('#pc_event_add').setAttribute('data-pc-action', 'add');
      Swal.fire({
        customClass: {
          confirmButton: 'btn btn-light-primary'
        },
        buttonsStyling: false,
        icon: 'success',
        title: 'Success',
        text: 'Event Updated successfully'
      });
    }
    calendaroffcanvas.hide();
  });
}

var pc_event_edit = document.querySelector('#pc_event_edit');
if (pc_event_edit) {
  pc_event_edit.addEventListener('click', function () {
    var e_title = calendevent.title === undefined ? '' : calendevent.title;
    var e_desc = calendevent.extendedProps.description === undefined ? '' : calendevent.extendedProps.description;
    var e_date_start = calendevent.start === null ? '' : dateformat(calendevent.start);
    var e_date_end = calendevent.end === null ? '' : " <i class='text-sm'>to</i> " + dateformat(calendevent.end);
    e_date_end = calendevent.end === null ? '' : e_date_end;
    var e_venue = calendevent.extendedProps.description === undefined ? '' : calendevent.extendedProps.venue;
    var e_type = calendevent.classNames[0] === undefined ? '' : calendevent.classNames[0];

    document.getElementById('pc-e-title').value = e_title;
    document.getElementById('pc-e-venue').value = e_venue;
    document.getElementById('pc-e-description').value = e_desc;
    document.getElementById('pc-e-type').value = e_type;
    var sdt = new Date(e_date_start);
    var edt = new Date(e_date_end);
    document.getElementById('pc-e-sdate').value = sdt.getFullYear() + '-' + getRound(sdt.getMonth() + 1) + '-' + getRound(sdt.getDate());
    document.getElementById('pc-e-edate').value = edt.getFullYear() + '-' + getRound(edt.getMonth() + 1) + '-' + getRound(edt.getDate());
    document.getElementById('pc-e-btn-text').innerHTML = '<i class="align-text-bottom me-1 ti ti-calendar-stats"></i> Update';
    document.querySelector('#pc_event_add').setAttribute('data-pc-action', 'edit');
    calendarmodal.hide();
    calendaroffcanvas.show();
  });
}

});
//  get round value
function getRound(vale) {
  var tmp = '';
  if (vale < 10) {
    tmp = '0' + vale;
  } else {
    tmp = vale;
  }
  return tmp;
}

//  get time
function getTime(temp) {
  temp = new Date(temp);
  if (temp.getHours() != null) {
    var hour = temp.getHours();
    var minute = temp.getMinutes() ? temp.getMinutes() : 00;
    return hour + ':' + minute;
  }
}

//  get date
function dateformat(dt) {
  var mn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var d = new Date(dt),
    month = '' + mn[d.getMonth()],
    day = '' + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [day + ' ' + month, year].join(',');
}

//  get full date
function timeformat(time) {
  var temp = time.split(':');
  var hours = temp[0];
  var minutes = temp[1];
  var newformat = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutes + ' ' + newformat;
}
})();
