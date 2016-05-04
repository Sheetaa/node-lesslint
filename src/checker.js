/**
 * @file checker 针对 less 文件的校验器
 * @author ielgnaw(wuji0223@gmail.com)
 */

'use strict';

import {formatMsg, getCandidates, getIgnorePatterns, isIgnored, getConfig} from './util';

// var path = require('path');
// var less = require('less');
// var Q = require('q');
// var edp = require('edp-core');

// var util = require('./util');

// var chalk = require('chalk');

// /**
//  * less 检测的默认配置
//  *
//  * @type {Object}
//  */
// var defaultConfig = require('./config');

// var LesslintVisitor = require('./LesslintVisitor');

// /**
//  * less parser 参数
//  *
//  * @type {Object}
//  */
// var parseOptions = {
//     paths: [path.dirname('.')],
//     includePath: [],
//     relativeUrls: true
//     // paths: [path.dirname(this.path)].concat(this.options.includePath)
// };

// var parser;

// /**
//  * 检测 css 文件内容
//  *
//  * @param {string} fileContent 文件内容
//  * @param {string} filePath 文件路径，根据这个参数来设置 less 编译时的 paths
//  * @param {Object=} rcConfig 检测规则的配置，可选
//  *
//  * @return {Promise} Promise 对象
//  */
// exports.checkString = function (fileContent, filePath, rcConfig) {

//     // 这里把文件内容的 \r\n 统一替换成 \n，便于之后获取行号
//     // less 编译的时候是以 \n 来界定的，返回的 rule 的 index 也会有影响
//     // （参见 less/lib/less/parser.js 第 630 行）
//     fileContent = fileContent.replace(/\r\n?/g, '\n');

//     // 如果 rcConfig 不存在，则用默认的配置，单独作为模块调用时用到
//     rcConfig = rcConfig || defaultConfig;

//     // 当前检测文件的相对路径
//     var relativePath = edp.path.relative(process.cwd(), filePath);

//     // 当前检测文件的绝对路径
//     var absolutePath = edp.path.join(process.cwd(), relativePath);

//     // 获取当前文件的目录的相对路径，并 push 到 less 的 paths 中
//     // TODO: 这里应该还应该支持设置路径 parseOptions.paths.concat(this.options.includePath)
//     var relativeDirPath = edp.path.relative(
//         process.cwd(),
//         absolutePath.slice(
//             0,
//             absolutePath.lastIndexOf('/')
//         )
//     );

//     if (parseOptions.paths.indexOf(relativeDirPath) === -1) {
//         parseOptions.paths.push(relativeDirPath);
//     }

//     var errors = [];
//     var deferred = Q.defer();
//     var errMsg = '';

//     parser = new (less.Parser)(parseOptions);
//     parser.parse(
//         fileContent,
//         function (err, tree) {
//             // parse 本身错误
//             if (err) {
//                 errMsg = err.message;
//                 if (err.extract) {
//                     errMsg += ': '
//                         + err.extract[1].slice(0, err.column)
//                         + err.extract[1].slice(err.column);
//                 }

//                 errors.push({
//                     path: filePath,
//                     messages: [
//                         {
//                             line: err.line,
//                             col: err.column + 1,
//                             message: ''
//                                 + 'LESS `'
//                                 + err.type
//                                 + '` Error, '
//                                 + errMsg,
//                             colorMessage: ''
//                                 + chalk.red(
//                                     'LESS `' + chalk.red(err.type) + '` Error, ' + errMsg
//                                 )
//                         }
//                     ]
//                 });
//                 deferred.reject(errors);
//                 return;
//             }

//             var lesslintVisitor = new LesslintVisitor({
//                 fileData: fileContent,
//                 filePath: filePath,
//                 detectConfigs: rcConfig
//             });

//             lesslintVisitor.exec(tree);

//             var invalidList = lesslintVisitor.invalidList;

//             if (invalidList.length) {
//                 errors.push({
//                     path: filePath,
//                     messages: invalidList
//                 });
//             }

//             errors.forEach(
//                 function (error) {
//                     error.messages = util.uniqueMsg(error.messages);
//                 }
//             );

//             // var safeStringify = require('json-stringify-safe');
//             // var ast = safeStringify(tree, null, 4);
//             // var outputFilename = __dirname + path.sep + 'ast.json';
//             // require('fs').writeFileSync(outputFilename, ast);

//             try {
//                 tree.toCSS();
//             }
//             catch (e) {
//                 // less 中引用一个不存在的变量会导致 toCSS 错误
//                 /* istanbul ignore next */
//                 // parse css 错误
//                 errMsg = e.message;
//                 /* istanbul ignore next */
//                 if (e.extract) {
//                     errMsg += ': '
//                         + e.extract[1].slice(0, e.column)
//                         + e.extract[1].slice(e.column);
//                 }
//                 /* istanbul ignore next */
//                 errors.push({
//                     path: filePath,
//                     messages: [
//                         {
//                             line: e.line,
//                             col: e.column + 1,
//                             message: ''
//                                 + 'LESS `'
//                                 + e.type
//                                 + '` Error, '
//                                 + errMsg,
//                             colorMessage: ''
//                                 + chalk.red(
//                                     'LESS `' + chalk.red(e.type) + '` Error, ' + errMsg
//                                 )
//                         }
//                     ]
//                 });
//                 /* istanbul ignore next */
//                 deferred.reject(errors);
//                 /* istanbul ignore next */

//                 console.warn(errors[0]);
//                 return;
//             }
//             deferred.resolve(errors);
//         }
//     );

//     return deferred.promise;
// };

// /**
//  * 校验文件
//  *
//  * @param {Object} file 包含 path 和 content 键的对象
//  * @param {Array} errors 本分类的错误信息数组
//  * @param {Function} done 校验完成的通知回调
//  */
// exports.check = function (file, errors, done) {
//     if (util.isIgnored(file.path, '.lesslintignore')) {
//         done();
//         return;
//     }

//     var rcConfig = util.getConfig('.lesslintrc', file.path, defaultConfig);

//     /**
//      * checkString 的 promise 的 reject 和 resolve 的返回值的结构以及处理方式都是一样的
//      * reject 指的是 parse 本身的错误以及 ast.toCSS({}) 的错误，这些代表程序的错误。
//      * resolve 代表的是 lesslint 检测出来的问题
//      *
//      * @param {Array.<Object>} invalidList 错误信息集合
//      */
//     var thenFunc = function (invalidList) {
//         if (invalidList.length) {
//             invalidList.forEach(function (invalid) {
//                 errors.push({
//                     path: invalid.path,
//                     messages: invalid.messages
//                 });
//             });
//         }
//         done();
//     };

//     exports.checkString(file.content, file.path, rcConfig).then(thenFunc, thenFunc);
// };


export function checkString(args) {
}

import Manis from 'manis';
import {readFileSync} from 'fs';
import {join} from 'path';

export function check(file, errors, done) {
    console.warn(file.path);
    if (isIgnored(file.path, '.lesslintignore')) {
        done();
        return;
    }

    var JSON_YAML_REG = /(.+)\.(?:json|yml)$/i;

    // var manis = new Manis('.config.yml', {
    //     orphan: true
    // });
    var manis = new Manis({
        files: [
            'config.yml',
            'custom.yml'
        ]
    });

    // var givenFilePath = join(__dirname, './test/fixture/custom.yml');
    var givenFilePath = './test/fixture/esui.less';
    console.warn(givenFilePath);

    manis.setDefault(join(__dirname, './config.yml'), {
        // orphan: true
    });
    // manis.setUserConfig(givenFilePath, {
    //     orphan: true
    // });
    console.warn(manis);
    console.warn();
    console.warn(manis.from(givenFilePath));

    // var manis = new Manis({
    //     files: [
    //         join(__dirname, './config.yml'),
    //         join(__dirname, './test/fixture/custom.yml')
    //     ],
    //     merge: true
    // });
    // manis.setDefault(join(__dirname, './config.yml'), {
    //     orphan: true
    // });
    // manis.setUserConfig('./test/fixture/custom.yml', {
    //     orphan: true
    // });
    // console.warn(manis);
    // console.warn(manis.from(join(__dirname, './test/fixture/custom.yml')));

    // console.log(Manis.loader(readFileSync(join(__dirname, './config.yml'), 'utf-8'), join(__dirname, './config.yml')));

    // var rcConfig = getConfig('.lesslintrc', file.path, defaultConfig);

    // /**
    //  * checkString 的 promise 的 reject 和 resolve 的返回值的结构以及处理方式都是一样的
    //  * reject 指的是 parse 本身的错误以及 ast.toCSS({}) 的错误，这些代表程序的错误。
    //  * resolve 代表的是 lesslint 检测出来的问题
    //  *
    //  * @param {Array.<Object>} invalidList 错误信息集合
    //  */
    // var thenFunc = function (invalidList) {
    //     if (invalidList.length) {
    //         invalidList.forEach(function (invalid) {
    //             errors.push({
    //                 path: invalid.path,
    //                 messages: invalid.messages
    //             });
    //         });
    //     }
    //     done();
    // };

    // exports.checkString(file.content, file.path, rcConfig).then(thenFunc, thenFunc);
}
