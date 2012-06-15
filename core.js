window.CopyEdit = CopyEdit = {};

(function($){
    
    CopyEdit = {
        // jQuery selector
        editableElementSelector: 'p, span, h1, h2, h3, h4, h5, h6, input, button, dt, dd, li, th, td, blockquote, strong, b, em, i, legend, figcaption, label',

        // border style for editable elements
        editableElementBorderCSS: '1px dotted #d00',
        
        // border style for elements that have been edited
        editedElementBorderCSS: '2px dotted #0b0',
        
        // set up the buttons and stuff
        init: function() {
            // add start button
            var startButton = $('<a />').attr('id', 'btn-copyedit-start')
                                        .attr('href', '#')
                                        .html('Start')
                                        .css({
                                            'position': 'absolute',
                                            'top': '5px',
                                            'right': '5px',
                                            'font-weight': 'bold'
                                        })
                                        .appendTo($('body'))
                                        .on('click.copyedit', function(e) {
                                            e.preventDefault();
                                            CopyEdit.startEditing();
                                        });
                                        
            // add stop button
            var stopButton = $('<a />').attr('id', 'btn-copyedit-stop')
                                       .attr('href', '#')
                                       .html('Stop')
                                       .css({
                                           'position': 'absolute',
                                           'top': '25px',
                                           'right': '5px',
                                           'font-weight': 'bold'
                                       })
                                       .appendTo($('body'))
                                       .on('click.copyedit', function(e) {
                                           e.preventDefault();
                                           CopyEdit.stopEditing();
                                       });
                                        
            // add save button
            var saveButton = $('<a />').attr('id', 'btn-copyedit-save')
                                       .attr('href', '#')
                                       .html('Save')
                                       .css({
                                           'position': 'absolute',
                                           'top': '50px',
                                           'right': '5px'
                                       })
                                       .appendTo($('body'))
                                       .on('click.copyedit', function(e) {
                                           e.preventDefault();
                                           CopyEdit.saveEdits();
                                       });
                                       
           // add hidden field for file uploads, and listen for change event
           $("<input type='file' id='copyedit-filefield' style='display: none;' />")
               .appendTo($('body'))[0]
               .addEventListener("change", CopyEdit.loadEdits, false);
           
           // add load button
           var loadButton = $('<a />').attr('id', 'btn-copyedit-load')
                                      .attr('href', '#')
                                      .html('Load')
                                      .css({
                                          'position': 'absolute',
                                          'top': '75px',
                                          'right': '5px'
                                      })
                                      .appendTo($('body'))
                                      .on('click.copyedit', function(e) {
                                          e.preventDefault();
                                          // trigger a click on the filefield to display dialog
                                          $('#copyedit-filefield').trigger('click');
                                      });
        },
        
        // set up editing on all editable elements
        startEditing: function() {
            $(CopyEdit.editableElementSelector).each(function(i, elem) {
                $(elem).addClass('copyedit-enabled')
                       .data('previousContentEditableValue', ($(elem).attr('contenteditable') ? $(elem).attr('contenteditable') : false))
                       .attr('contenteditable', 'true')
                       .data('previousBorderStyle', $(elem).css('border'))
                       .css('border', CopyEdit.editableElementBorderCSS)
                       .on('focus.copyedit', function() {
                           if (!$(this).data('touched')) {
                               // element hasn't been focused before, save its contents
                               $(this).data('originalContents', $(this).html());
                               $(this).data('touched', true);
                           }
                       })
                       .on('blur.copyedit', function() {
                           if ($(this).html() != $(this).data('originalContents')) {
                               $(this).css('border', CopyEdit.editedElementBorderCSS);
                           }
                           else {
                               $(this).css('border', CopyEdit.editableElementBorderCSS);
                           }
                       });
                       
                // has the element already been edited previously?
                if ($(elem).data('touched')) {
                    if ($(elem).html() != $(elem).data('originalContents')) {
                        $(elem).css('border', CopyEdit.editedElementBorderCSS);
                    }
                    else {
                        $(elem).css('border', CopyEdit.editableElementBorderCSS);
                    }
                }
            });
        },
        
        // restore editable elements to their previous styles (keeping edited content)
        stopEditing: function() {
            $('.copyedit-enabled').each(function(i, elem) {
                $(elem).removeClass('copyedit-enabled')
                       .attr('contenteditable', $(elem).data('previousContentEditableValue'))
                       .css('border', $(elem).data('previousBorderStyle'))
                       .off('focus.copyedit')
                       .off('blur.copyedit');
            });
        },
        
        // save edits to json file
        saveEdits: function() {
            // iterate all editable items, check which have changed
            var copyEdits = {
                'pageinfo': {
                    'location': window.location.href,
                    'title': document.title
                },
                'edits': []
            };
            $('.copyedit-enabled').each(function(i, elem) {
                if ($(elem).data('touched')) {
                    if ($(elem).html() != $(elem).data('originalContents')) {
                        // remove copyedit class to avoid contaminating path
                        $(elem).removeClass('copyedit-enabled');
                        copyEdits.edits.push({
                            path: $(elem).getPath().replace(/(\.$)/g, ''),
                            idx: $(elem).index(),
                            oldContent: $(elem).data('originalContents'),
                            newContent: $(elem).html()
                        });
                        // restore class
                        $(elem).addClass('copyedit-enabled');
                    }
                }
            });
            
            if (copyEdits.edits.length) {
                var bb = new BlobBuilder;
                bb.append(JSON.stringify(copyEdits));
                var blob = bb.getBlob("application/json");
                saveAs(blob, "copyedits.json");
            }
            else {
                alert("No copy changes have been made.");
            }
        },
        
        // load edits from json file
        loadEdits: function() {
            var files = this.files;
            var fr = new FileReader();
            if (files.length == 1) {
                fr.onload = function (e) {
                    var copyEdits = JSON.parse(e.target.result);
                    $.each(copyEdits.edits, function(i, elem) {
                        $(elem.path, elem.idx).data('touched', true);
                        $(elem.path, elem.idx).data('originalContents', $(elem.path, elem.idx).html());
                        
                        $(elem.path, elem.idx).html(elem.newContent)
                                              .css('border', CopyEdit.editedElementBorderCSS);
                    });
                    
                    alert("Loaded " + copyEdits.edits.length + " edit(s) from file.");
                };
                fr.readAsText(files[0]);
            }
            else {
                alert("Whoops, please select one file.");
            }
        }
    };
    
    
    // docready
    $(document).ready(function() {
        // here we go!
        CopyEdit.init();
    });
    
}(jQuery));