'use strict';
/**
 * 自动生成mock rewrite配置（Compile 阶段插件接口）
 * @param  {string} content     文件内容
 * @param  {File}   file        fis 的 File 对象 [fis3/lib/file.js]
 * @param  {object} settings    插件配置属性
 * @return {string}             处理后的文件内容
 */
module.exports = function (content, file, settings) {
    settings = settings || {};
    var rPath = settings.rPath || 'mock';
    var include = settings.include || '*.json';
    var exclude = settings.exclude || null;
    var rExt = (settings.rExt || '').replace(/\./, '\\.');
    var rename = settings.rename || null;
    var files = fis.util.find(fis.project.getProjectPath(rPath), include, exclude);
    var result = [];

    for (var i = 0; i < files.length; i++) {
        var path = fis.util.ext(files[i]);
        var arr = [];
        arr.push('rewrite');
        if (typeof rename == 'function') {
            arr.push(rename(path, settings));
        } else {
            arr.push('^\/' + path.filename.replace(/_/, '\\/') + rExt + '$');
        }
        arr.push('/' + rPath + '/' + path.basename);
        result.push(arr.join(' '));
    }

    content = content.replace(/__REWRITE_RULES__/, result.join('\n'));
    return content;
};
