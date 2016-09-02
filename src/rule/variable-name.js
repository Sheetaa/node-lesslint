/**
 * @file 变量检验
 *       变量命名必须（MUST）采用 @foo-bar 形式，不得（MUST NOT）使用 @fooBar 形式。
 *       https://github.com/ecomfe/spec/blob/master/less-code-style.md#%E5%8F%98%E9%87%8F
 * @author ielgnaw(wuji0223@gmail.com)
 */

import chalk from 'chalk';
import postcss from 'postcss';
import {getLineContent} from '../util';

'use strict';

/**
 * 规则名称
 *
 * @type {string}
 */
const RULENAME = 'variable-name';

/**
 * 匹配变量名字的正则
 *
 * @type {RegExp}
 */
const VARIABLE_NAME_REG = /^@([a-z0-9\-]+)$/;

/**
 * 错误信息
 *
 * @type {string}
 */
const MSG = 'Variable name must be like this `@foo-bar or @foobar`';

/**
 * 具体的检测逻辑
 *
 * @param {Object} opts 参数
 * @param {*} opts.ruleVal 当前规则具体配置的值
 * @param {string} opts.fileContent 文件内容
 * @param {string} opts.filePath 文件路径
 */
const check = postcss.plugin(RULENAME, (opts) => {
    return (css, result) => {
        if (!opts.ruleVal) {
            return;
        }

        css.walkDecls((decl) => {
            let lineNum = decl.source.start.line;
            let lineContent = getLineContent(lineNum, opts.fileContent);
            let prop = decl.prop;

            if (prop.startsWith('@')
                && !VARIABLE_NAME_REG.test(prop)
            ) {
                result.warn(RULENAME, {
                    node: decl,
                    ruleName: RULENAME,
                    line: lineNum,
                    col: decl.source.start.column,
                    message: '`' + lineContent + '` ' + MSG,
                    colorMessage: '`' + lineContent.replace(
                            prop,
                            ($1) => {
                                return chalk.magenta($1);
                            }
                        )
                        + '` '
                        + chalk.grey(MSG)
                });
            }
        });
    };
});

export {check};