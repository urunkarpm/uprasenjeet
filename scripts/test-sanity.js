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
});
