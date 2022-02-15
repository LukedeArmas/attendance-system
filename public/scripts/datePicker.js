(function() {
  'use strict'

  // This function checks if a date is in our list of invalid dates (attendance already taken for that date) and returns true or false
  function disableDates(date) {
      var string = moment(date).format('L');
      return invalidDates.indexOf(string) == -1
  }

  // Date picker. Prevents date from being chosen that is either past today or where attendance has been taken for that date
  $(function() {
      $('#datepicker').datepicker({
        endDate: '0d',
        autoclose: 'true',
        beforeShowDay: disableDates
      })
  })
})()



