'use strict';
const fs = require("fs");
// const esprima = require('esprima');
// const estraverse = require('estraverse');
const parser = require("@babel/parser");
const traverse = require('@babel/traverse').default;
// const template = require('@babel/template').default;  添加ast使用
function transformCode2Ast(code) {
  return parser.parse(code, {
    sourceType: 'module',
    plugins: [
      "jsx",
    ],
  });
}
class PreventWhiteScreen {
  constructor() {
    this.startTime = Date.now();
    this.prevTimestamps = new Map();
  }
  apply(compiler) {
      compiler.hooks.emit.tap("PreventWhiteScreen", (compilation) => {
        const changedFiles = Array.from(compilation.fileTimestamps.keys()).filter(
          (watchfile) => {
            return (
              (this.prevTimestamps.get(watchfile) || this.startTime) <
              (compilation.fileTimestamps.get(watchfile) || Infinity)
            );
          }
        );
        this.prevTimestamps = compilation.fileTimestamps;
        changedFiles.forEach(item => {
          let suffix = '';
          try {
            const flieArr = item.split('.');
            suffix = flieArr[flieArr.length - 1];
          } catch (err) {
            suffix = '';
          }
          if(['js','jsx','ts','tsx'].includes(suffix)){
            fs.readFile(item,(err,data) => {
              if(err){
                console.log(err);
              }else{
                const ast = transformCode2Ast(data.toString());
                traverse(ast, {
                  enter(path) {
                    let importModule = true;
                    if(path.node.type === 'ImportDeclaration' && path.node.source.value === 'aa'){
                      importModule = false
                    };
                    if(path.node.type === 'ExportDefaultDeclaration' && path.scope.references.React && path.node.declaration.type === 'Identifier'){
                      const replaceStr = `export default aa(${path.node.declaration.name});`;
                      let sourceModule = data.toString();
                      if(importModule){
                        sourceModule = "import aa from 'aa';\n" + sourceModule;
                      }
                      fs.writeFile(item,sourceModule.replace(`export default ${path.node.declaration.name};`,replaceStr),{flag:'w'},() => {
                        console.log('修改成功');
                      });
                    }
                  },
                });
              }
            })
          }
        })
      });
  }
}

module.exports = PreventWhiteScreen;
