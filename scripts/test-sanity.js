import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const htmlPath = path.join(rootDir, 'index.html');

test('Portfolio Sanity & Quality Assurance Suite', async (t) => {
  assert.ok(fs.existsSync(htmlPath), 'index.html should exist');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  await t.test('Primary Navigation Target Sections Exist', () => {
    const requiredIds = ['welcome', 'work', 'about', 'certifications', 'contact'];
    for (const id of requiredIds) {
      assert.ok(
        htmlContent.includes(`id="${id}"`),
        `HTML must contain element with id="${id}"`
      );
    }
  });

  await t.test('Content-Security-Policy Meta Tag is Secure', () => {
    const cspMatch = htmlContent.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"/i);
    assert.ok(cspMatch, 'CSP meta tag should exist');
    const cspContent = cspMatch[1];
    
    // Check that script-src does not allow unsafe-inline
    const scriptSrcMatch = cspContent.match(/script-src\s+([^;]+)/i);
    assert.ok(scriptSrcMatch, 'script-src directive should exist in CSP');
    assert.ok(
      !scriptSrcMatch[1].includes("'unsafe-inline'"),
      'script-src should NOT allow \'unsafe-inline\''
    );
  });

  await t.test('No Inline Event Handlers in HTML', () => {
    const inlineHandlerRegex = /\son[a-z]+=/i;
    assert.equal(
      inlineHandlerRegex.test(htmlContent),
      false,
      'HTML should not contain inline event handlers like onload=, onclick=, etc.'
    );
  });

  await t.test('All External Links Include rel="noopener noreferrer"', () => {
    const linkRegex = /<a\s+[^>]*target="_blank"[^>]*>/gi;
    let match;
    while ((match = linkRegex.exec(htmlContent)) !== null) {
      const linkTag = match[0];
      assert.ok(
        linkTag.includes('rel="noopener noreferrer"') || linkTag.includes('rel="noreferrer noopener"'),
        `Target _blank link missing rel="noopener noreferrer": ${linkTag}`
      );
    }
  });

  await t.test('Img Tags Have Alt Attributes', () => {
    const imgRegex = /<img\s+[^>]*>/gi;
    let match;
    while ((match = imgRegex.exec(htmlContent)) !== null) {
      const imgTag = match[0];
      assert.ok(
        imgTag.includes('alt='),
        `img tag missing alt attribute: ${imgTag}`
      );
    }
  });

  await t.test('Web Animation Enhancements Specifications', async (st) => {
    const cssPath = path.join(rootDir, 'assets', 'css', 'components', 'components.css');
    const themeJsPath = path.join(rootDir, 'assets', 'js', 'modules', 'theme.js');
    const animJsPath = path.join(rootDir, 'assets', 'js', 'modules', 'animations.js');

    assert.ok(fs.existsSync(cssPath), 'components.css should exist');
    assert.ok(fs.existsSync(themeJsPath), 'theme.js should exist');
    assert.ok(fs.existsSync(animJsPath), 'animations.js should exist');

    const cssContent = fs.readFileSync(cssPath, 'utf8');
    const themeJsContent = fs.readFileSync(themeJsPath, 'utf8');
    const animJsContent = fs.readFileSync(animJsPath, 'utf8');

    await st.test('1. Scroll Progress Bar Element and CSS', () => {
      assert.ok(htmlContent.includes('id="scroll-progress"'), 'HTML must contain id="scroll-progress"');
      assert.ok(cssContent.includes('.scroll-progress'), 'CSS must contain .scroll-progress rule');
      assert.ok(cssContent.includes('animation-timeline: scroll(root block);'), 'CSS must use animation-timeline: scroll()');
    });

    await st.test('2. View Transitions API Theme Toggle', () => {
      assert.ok(themeJsContent.includes('startViewTransition'), 'theme.js must use startViewTransition');
      assert.ok(cssContent.includes('::view-transition-old(root)'), 'CSS must contain ::view-transition-old(root)');
      assert.ok(cssContent.includes('::view-transition-new(root)'), 'CSS must contain ::view-transition-new(root)');
    });

    await st.test('3. Bento Grid Border Tracing Glow', () => {
      assert.ok(cssContent.includes('@property --border-angle'), 'CSS must define @property --border-angle');
      assert.ok(cssContent.includes('conic-gradient(from var(--border-angle)'), 'CSS must use conic-gradient with --border-angle');
    });

    await st.test('4. Text Scramble Matrix Effect', () => {
      assert.ok(animJsContent.includes('export function initTextScramble'), 'animations.js must export initTextScramble');
      assert.ok(htmlContent.includes('data-scramble'), 'HTML must contain data-scramble attributes');
    });
  });
});


