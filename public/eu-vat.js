"use strict";

(function( $ ) {
    $.validate = function( form ) {
        var valid = true;
        form.find( ":input" ).each(function() {
           if( $( this ).val() === "" ) {
               valid = false;
           }
        });
        return valid;
    };
    $(function() {
       $( "#eu-vat-form" ).on( "submit", function( e ) {
          e.preventDefault();

          $( "#results" ).hide().removeClass();

          var $form = $( this );
          var valid = $.validate( $form );
          if( !valid ) {
              $( "#results" ).text( "All fields are required" ).addClass( "text-danger" ).show();
          } else {
              $.post('/validate', $form.serialize(), function( response ) {
                 if( response.valid ) {
                     $( "#results" ).text( "Valid EU VAT number" ).addClass( "text-success" ).show();
                 } else {
                     $( "#results" ).text( "Invalid EU VAT number. Maybe it's not been inserted in the EU database yet." ).addClass( "text-danger" ).show();
                 }
              });
          }
       });
    });
})( jQuery );