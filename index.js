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
    var files = fis.util.find(fis.project.getProjectPath(rPath), include, exclude);
    var result = [];

    for (var i = 0; i < files.length; i++) {
        var path = fis.util.ext(files[i]);
        result.push('rewrite ^\/' + path.filename.replace(/_/, '\\/') + '$ /' + rPath + '/' + path.basename);
    }
    content = content.replace(/__REWRITE_RULES__/, result.join('\n'));
    return content;
};
