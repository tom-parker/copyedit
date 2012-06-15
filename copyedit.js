(function(){
    
    /*
     * copyedit v0.1
     * ~jmt 06/2012
     *
     * Requires support for addEventListener, File, FileReader
     *
     */

    var script;
    var urlPrefix = 'http://copyedit.dev/';
    
    // add jquery if not already present
    if (typeof jQuery == 'undefined') {
        script = document.createElement('script');
        script.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js');
        document.getElementsByTagName('head')[0].appendChild(script);
    }
    
    // add jquery-getpath
    script = document.createElement('script');
    script.setAttribute('src', urlPrefix + 'jquery-getpath.js');
    document.getElementsByTagName('head')[0].appendChild(script);
    
    // add JSON2 (only older browsers will use it)
    if (typeof JSON == 'undefined') {
        script = document.createElement('script');
        script.setAttribute('src', urlPrefix + 'json2.js');
        document.getElementsByTagName('head')[0].appendChild(script);
    }
    
    // add BlobBuilder
    script = document.createElement('script');
    script.setAttribute('src', urlPrefix + 'BlobBuilder.js');
    document.getElementsByTagName('head')[0].appendChild(script);
    
    // add FileSaver
    script = document.createElement('script');
    script.setAttribute('src', urlPrefix + 'FileSaver.js');
    document.getElementsByTagName('head')[0].appendChild(script);
    
    // add core
    script = document.createElement('script');
    script.setAttribute('src', urlPrefix + 'core.js');
    document.getElementsByTagName('head')[0].appendChild(script);
    
}());