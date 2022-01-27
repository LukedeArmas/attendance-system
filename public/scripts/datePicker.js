function disableDates(date) {
    var string = moment(date).format('L');
    return invalidDates.indexOf(string) == -1
}

$(function() {
    $('#datepicker').datepicker({
      endDate: '0d',
      autoclose: 'true',
      beforeShowDay: disableDates
    })
})

