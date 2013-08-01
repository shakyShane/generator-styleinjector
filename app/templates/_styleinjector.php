<script src="http://<%= hostIp %>:<%= port %>/socket.io/socket.io.js"></script>
<script type="text/javascript">
    var socket = io.connect('http://<%= hostIp %>:<%= port %>');
    socket.on('reload', function (data) {
        if (data) {
            if (data.url) {
                location.reload();
            } else {
                swapFile(data.assetUrl, getTagName(data.fileExtention));
            }
        }
    });

    var options = {
        tagNames: {
            "css" : "link",
            "jpg" : "img",
            "png" : "img",
            "js"  : "script"
        },
        attrs : {
            "link"   : "href",
            "img"    : "src",
            "script" : "src"
        }
    };

    /**
     *
     * @param {NodeList} tags - array of
     * @param {string} url
     * @returns {Array}
     * @param {string} attr
     */
    function getMatch(tags, url, attr) {

        var matches = [],
            regex = /.+?:\/\/.+?(\/.+?)(?:#|\?|$)/,
            href, shortMatch;

        for (var i = 0, len = tags.length; i < len; i += 1) {
            href = tags[i][attr];
            var pathname = regex.exec( tags[i][attr] );

            if (pathname) {
                if (pathname[1] === url) {
                    matches.push(i);
                }
            } else { // IE7  - check for matches on the SHORT STRING

                if (href === url) {
                    matches.push(i);
                } else {

                    var shortregex = new RegExp(url);
                    shortMatch = shortregex.test(href);

                    if (shortMatch) {
                        matches.push(i);
                    }
                }
            }
        }
        return matches;
    }

    /**
     * Get HTML tags
     * @param tagName
     * @returns {NodeList}
     */
    function getTags(tagName) {
        return document.getElementsByTagName(tagName);
    }

    /**
     *
     * Get Tag Name from file extension
     *
     */
    function getTagName(fileExtention) {
        return options.tagNames[fileExtention.replace(".", "")];
    }

    /**
     * Swap the File in the DOM
     * @param {string} url
     * @param {string} tagName
     */
    function swapFile (url, tagName) {
        var elems = getTags(tagName),
            attr  = options.attrs[tagName];

        if (elems) {
            var match = getMatch(elems, url, attr);
            if (match) {
                updateElem(elems[match], url, attr);
            }
        }
    }

    /**
     * Update the Dom Elem with the new time stamp
     * @param elem
     * @param url
     * @param attr
     */
    function updateElem(elem, url, attr) {
        elem[attr] = url + "?rel=" + new Date().getTime();
    }
</script>