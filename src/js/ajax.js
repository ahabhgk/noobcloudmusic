function ajax(options) {
    var opts = {
        method: (options.method || "GET").toUpperCase(),
        url: options.url || "",
        async: options.async || true,
        headers: options.headers || "",
        data: options.data || "",
        dataType: options.dataType || "json"
    }
    function formatsData(data) {
        var arr = []
        for (let key in data) {
            arr.push(key + '=' + data[key])
        }
        return arr.join('&')
    }
    var xhr = new XMLHttpRequest()
    return new Promise((resolve, reject) => {
        if (opts.method === 'GET') {
            xhr.open(opts.method, opts.url + '?' + formatsData(opts.data), opts.async)
            xhr.send()
        } else if (opts.method === 'POST') {
            xhr.open(opts.method, opts.url, opts.async)
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=UTF-8")
            if (opts.headers !== '') {
                for (let [key, value] of Object.entries(opts.headers)) {
                    xhr.setRequestHeader(key, value)
                }
            }
            xhr.send(opts.data)
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
                switch (opts.dataType) {
                    case "json":
                        var json = JSON.parse(xhr.responseText)
                        resolve(json)
                        break
                    case "xml":
                        resolve(xhr.responseXML)
                        break
                    default:
                        resolve(xhr.responseText)
                        break
                }
            }
        }
        xhr.onerror = function() {
            reject({
                errorType: 'onerror'
            })
        }
    })
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}