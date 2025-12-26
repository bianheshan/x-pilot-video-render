/**
 * Remotion Studio 选择器查找工具
 * 
 * 使用方法：
 * 1. 打开 Remotion Studio (http://localhost:3000)
 * 2. 按 F12 打开开发者工具
 * 3. 切换到 Console 标签
 * 4. 复制此文件内容并粘贴到控制台
 * 5. 按回车执行
 * 6. 查看输出的选择器建议
 */

(function() {
  console.log('🔍 正在查找 Remotion Studio 菜单栏元素...\n');
  
  // 查找所有可能的菜单栏元素
  const candidates = [];
  
  // 1. 查找 header 元素
  const headers = document.querySelectorAll('header');
  headers.forEach((el, i) => {
    if (!el.textContent.toLowerCase().includes('timeline')) {
      candidates.push({
        element: el,
        type: 'header',
        selector: `header:nth-of-type(${i + 1})`,
        testId: el.getAttribute('data-testid'),
        className: el.className,
        position: el.getBoundingClientRect(),
      });
    }
  });
  
  // 2. 查找 nav 元素
  const navs = document.querySelectorAll('nav');
  navs.forEach((el, i) => {
    if (!el.textContent.toLowerCase().includes('timeline')) {
      candidates.push({
        element: el,
        type: 'nav',
        selector: `nav:nth-of-type(${i + 1})`,
        testId: el.getAttribute('data-testid'),
        className: el.className,
        position: el.getBoundingClientRect(),
      });
    }
  });
  
  // 3. 查找固定在顶部的元素
  const fixedElements = document.querySelectorAll('*');
  fixedElements.forEach((el) => {
    const style = window.getComputedStyle(el);
    if (style.position === 'fixed' && el.getBoundingClientRect().top === 0) {
      const testId = el.getAttribute('data-testid');
      const className = el.className;
      if (testId && !testId.includes('timeline') && !candidates.find(c => c.element === el)) {
        candidates.push({
          element: el,
          type: 'fixed-top',
          selector: testId ? `[data-testid="${testId}"]` : el.tagName.toLowerCase(),
          testId: testId,
          className: className,
          position: el.getBoundingClientRect(),
        });
      }
    }
  });
  
  // 4. 查找所有带有 data-testid 的元素
  const testIdElements = document.querySelectorAll('[data-testid]');
  testIdElements.forEach((el) => {
    const testId = el.getAttribute('data-testid');
    if (testId && (testId.includes('top') || testId.includes('menu') || testId.includes('header'))) {
      if (!candidates.find(c => c.element === el)) {
        candidates.push({
          element: el,
          type: 'data-testid',
          selector: `[data-testid="${testId}"]`,
          testId: testId,
          className: el.className,
          position: el.getBoundingClientRect(),
        });
      }
    }
  });
  
  // 输出结果
  console.log(`找到 ${candidates.length} 个可能的菜单栏元素：\n`);
  
  candidates.forEach((candidate, i) => {
    console.log(`\n${i + 1}. ${candidate.type.toUpperCase()}`);
    console.log(`   选择器: ${candidate.selector}`);
    if (candidate.testId) {
      console.log(`   data-testid: ${candidate.testId}`);
    }
    if (candidate.className) {
      console.log(`   class: ${candidate.className.substring(0, 100)}`);
    }
    console.log(`   位置: top=${candidate.position.top}, height=${candidate.position.height}`);
    
    // 高亮显示
    candidate.element.style.outline = '3px solid red';
    candidate.element.style.outlineOffset = '2px';
  });
  
  // 生成 CSS 建议
  console.log('\n\n📝 建议的 CSS 规则：\n');
  console.log('/* 复制以下内容到 Stylus 扩展中 */\n');
  
  const cssRules = candidates.map(c => {
    if (c.testId) {
      return `[data-testid="${c.testId}"]`;
    }
    return c.selector;
  }).filter((v, i, a) => a.indexOf(v) === i); // 去重
  
  cssRules.forEach(selector => {
    console.log(`${selector} {`);
    console.log('  display: none !important;');
    console.log('}\n');
  });
  
  console.log('\n✅ 提示：红色边框标记的元素就是可能的菜单栏元素');
  console.log('   如果确认，请复制上面的 CSS 规则到 Stylus 扩展中');
  
  // 返回候选元素数组，方便进一步操作
  return candidates;
})();

