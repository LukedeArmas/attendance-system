document.addEventListener('DOMContentLoaded', function (e) {
    const fv = FormValidation.formValidation(document.getElementById('attendanceForm'), {
        fields: {
            date: {
                validators: {
                    notEmpty: {
                        message: 'The date is required',
                    },
                    date: {
                        format: 'MM/DD/YYYY',
                        message: 'The date is not valid',
                    },
                },
            },
        },
        plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap: new FormValidation.plugins.Bootstrap(),
            submitButton: new FormValidation.plugins.SubmitButton(),
            icon: new FormValidation.plugins.Icon({
                valid: 'fa fa-check',
                invalid: 'fa fa-times',
                validating: 'fa fa-refresh',
            }),
        },
    })

    $('[name="date"]')
        .datepicker({
            format: 'mm/dd/yyyy',
        })
        .on('changeDate', function (e) {
            // Revalidate the date field
            fv.revalidateField('date');
        });
})