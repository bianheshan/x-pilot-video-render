/**
 * Remotion Studio 诊断工具
 * 在浏览器控制台中运行此脚本来检查问题
 */

console.log('🔍 Remotion Studio 诊断工具\n');

// 检查 1: React 是否正确加载
console.log('1. 检查 React...');
if (typeof React !== 'undefined') {
  console.log('   ✅ React 已加载:', React.version);
} else {
  console.log('   ❌ React 未加载');
}

// 检查 2: Remotion 是否正确加载
console.log('\n2. 检查 Remotion...');
if (typeof window !== 'undefined' && window.remotion) {
  console.log('   ✅ Remotion 已加载');
} else {
  console.log('   ⚠️  Remotion 可能未完全加载');
}

// 检查 3: 检查根组件
console.log('\n3. 检查根组件...');
const rootElement = document.getElementById('root') || document.querySelector('[data-remotion-root]');
if (rootElement) {
  console.log('   ✅ 找到根元素:', rootElement);
  console.log('   内容:', rootElement.innerHTML.substring(0, 200));
} else {
  console.log('   ❌ 未找到根元素');
}

// 检查 4: 检查错误
console.log('\n4. 检查控制台错误...');
const errors = [];
const originalError = console.error;
console.error = function(...args) {
  errors.push(args);
  originalError.apply(console, args);
};

// 检查 5: 检查网络请求
console.log('\n5. 检查关键文件加载...');
const scripts = Array.from(document.querySelectorAll('script[src]'));
console.log('   找到的脚本:', scripts.length);
scripts.forEach(script => {
  if (script.src.includes('remotion') || script.src.includes('react')) {
    console.log('   -', script.src);
  }
});

// 检查 6: 检查样式
console.log('\n6. 检查样式...');
const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
console.log('   样式表数量:', stylesheets.length);

// 输出建议
console.log('\n📋 诊断建议:');
console.log('1. 检查浏览器控制台是否有红色错误信息');
console.log('2. 检查 Network 标签，确认所有文件都成功加载');
console.log('3. 尝试硬刷新 (Ctrl+Shift+R 或 Cmd+Shift+R)');
console.log('4. 检查终端是否有构建错误');
console.log('5. 确认端口 3000 没有被其他程序占用');

// 返回诊断结果
return {
  reactLoaded: typeof React !== 'undefined',
  rootElement: !!rootElement,
  errors: errors.length,
  scripts: scripts.length,
  stylesheets: stylesheets.length
};

