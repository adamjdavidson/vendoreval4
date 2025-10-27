import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  frameworkSidebar: [
    {
      type: 'category',
      label: 'Framework Overview',
      items: [
        'framework/index',
        'framework/why-different',
        'framework/why-diff2',
        'framework/metaphors',
        'framework/cynical',
      ],
    },
    {
      type: 'category',
      label: 'Six Evaluation Criteria',
      items: [
        'framework/see',
        'framework/change',
        'framework/use',
        'framework/adapt',
        'framework/leave',
        'framework/learn',
      ],
    },
    {
      type: 'category',
      label: 'Maturity Model',
      items: [
        'maturity-model/overview',
        'maturity-model/level-1',
        'maturity-model/level-2',
        'maturity-model/level-3',
        'maturity-model/level-4',
      ],
    },
  ],

  // vendorsSidebar will be added when vendor documentation is created
  // vendorsSidebar: [
  //   {
  //     type: 'category',
  //     label: 'Pre-Analyzed Vendors',
  //     items: [
  //       'vendors/index',
  //       'vendors/glean',
  //     ],
  //   },
  // ],
};

export default sidebars;
