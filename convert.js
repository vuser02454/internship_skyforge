import fs from 'fs';

const files = [
  { file: 'code.html', name: 'Dashboard' },
  { file: 'code (2).html', name: 'SearchResults' },
  { file: 'code (3).html', name: 'NoTasks' },
  { file: 'code (4).html', name: 'Loading' },
  { file: 'code (5).html', name: 'TaskDetail' },
  { file: 'code (6).html', name: 'WorkSubmission' },
  { file: 'code (7).html', name: 'PostTask' }
];

function htmlToJsx(html) {
  let jsx = html;
  jsx = jsx.replace(/class="/g, 'className="');
  jsx = jsx.replace(/for="/g, 'htmlFor="');
  jsx = jsx.replace(/<!--(.*?)-->/gs, '{/*$1*/}');
  
  // Handle specific style tags
  jsx = jsx.replace(/style="font-variation-settings:\s*'FILL'\s*1;?"/g, "style={{ fontVariationSettings: \"'FILL' 1\" }}");
  jsx = jsx.replace(/style="font-size:\s*18px;?"/g, "style={{ fontSize: '18px' }}");
  jsx = jsx.replace(/style="font-size:\s*20px;?"/g, "style={{ fontSize: '20px' }}");
  jsx = jsx.replace(/style="font-size:\s*48px;?"/g, "style={{ fontSize: '48px' }}");
  
  // Other replacements
  jsx = jsx.replace(/selected=""/g, "selected");
  jsx = jsx.replace(/checked=""/g, "defaultChecked");
  jsx = jsx.replace(/disabled=""/g, "disabled");
  
  // Self-close tags. We'll do multiple passes if needed, but a single pass is usually okay
  jsx = jsx.replace(/<(img|input|hr|br|source)([^>]*?)(?<!\/)>/g, '<$1$2 />');
  
  return jsx;
}

fs.mkdirSync('src/pages', { recursive: true });

for (const {file, name} of files) {
  if (!fs.existsSync(file)) {
     console.log('Skipping ' + file);
     continue;
  }
  const content = fs.readFileSync(file, 'utf8');
  
  const mainMatch = content.match(/<main([^>]*)>([\s\S]*?)<\/main>/);
  if (mainMatch) {
    const mainAttrs = mainMatch[1];
    const innerContent = mainMatch[2];
    
    let mainContent = `<main${mainAttrs}>\n${innerContent}\n</main>`;
    mainContent = htmlToJsx(mainContent);
    const componentStr = `import React from 'react';\n\nexport default function ${name}() {\n  return (\n    ${mainContent}\n  );\n}\n`;
    fs.writeFileSync(`src/pages/${name}.jsx`, componentStr);
    console.log(`Generated src/pages/${name}.jsx`);
  } else {
    console.log('No <main> tag found in ' + file);
  }
}
