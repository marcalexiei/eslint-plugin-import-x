import { TSESLint } from '@typescript-eslint/utils'

import { parsers } from '../utils'

import rule from 'eslint-plugin-import-x/rules/newline-after-import'

const ruleTester = new TSESLint.RuleTester()

const getImportError = (count: number) => ({
  messageId: 'newline' as const,
  data: {
    count,
    lineSuffix: count > 1 ? 's' : '',
    type: 'import',
  },
})

const IMPORT_ERROR = getImportError(1)

const getRequireError = (count: number) => ({
  messageId: 'newline' as const,
  data: {
    count,
    lineSuffix: count > 1 ? 's' : '',
    type: 'require',
  },
})

const REQUIRE_ERROR = getRequireError(1)

ruleTester.run('newline-after-import', rule, {
  valid: [
    `var path = require('path');\nvar foo = require('foo');\n`,
    `require('foo');`,
    `switch ('foo') { case 'bar': require('baz'); }`,
    {
      code: `
        const x = () => require('baz')
            , y = () => require('bar')`,
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: `
        const x = () => require('baz')
            , y = () => require('bar')

        // some comment here
      `,
      parserOptions: { ecmaVersion: 6 },
      options: [{ considerComments: true }],
    },
    {
      code: `const x = () => require('baz') && require('bar')`,
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: `
        const x = () => require('baz') && require('bar')

        // Some random single line comment
        var bar = 42;
      `,
      parserOptions: { ecmaVersion: 6 },
      options: [{ considerComments: true }],
    },
    {
      code: `
        const x = () => require('baz') && require('bar')

        // Some random single line comment
        var bar = 42;
      `,
      parserOptions: { ecmaVersion: 6 },
      options: [{ considerComments: true, count: 1, exactCount: true }],
    },
    {
      code: `
        const x = () => require('baz') && require('bar')
        /**
         * some multiline comment here
         * another line of comment
        **/
        var bar = 42;
      `,
      parserOptions: { ecmaVersion: 6 },
    },
    `function x() { require('baz'); }`,
    `a(require('b'), require('c'), require('d'));`,
    `function foo() {
      switch (renderData.modalViewKey) {
        case 'value':
          var bar = require('bar');
          return bar(renderData, options)
        default:
          return renderData.mainModalContent.clone()
      }
    }`,
    {
      code: `//issue 441
    function bar() {
      switch (foo) {
        case '1':
          return require('../path/to/file1.jst.hbs')(renderData, options);
        case '2':
          return require('../path/to/file2.jst.hbs')(renderData, options);
        case '3':
          return require('../path/to/file3.jst.hbs')(renderData, options);
        case '4':
          return require('../path/to/file4.jst.hbs')(renderData, options);
        case '5':
          return require('../path/to/file5.jst.hbs')(renderData, options);
        case '6':
          return require('../path/to/file6.jst.hbs')(renderData, options);
        case '7':
          return require('../path/to/file7.jst.hbs')(renderData, options);
        case '8':
          return require('../path/to/file8.jst.hbs')(renderData, options);
        case '9':
          return require('../path/to/file9.jst.hbs')(renderData, options);
        case '10':
          return require('../path/to/file10.jst.hbs')(renderData, options);
        case '11':
          return require('../path/to/file11.jst.hbs')(renderData, options);
        case '12':
          return something();
        default:
          return somethingElse();
      }
    }`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `import path from 'path';\nimport foo from 'foo';\n`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `import path from 'path';import foo from 'foo';\n`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `import path from 'path';import foo from 'foo';\n\nvar bar = 42;`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `import foo from 'foo';\n\nvar bar = 'bar';`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `import foo from 'foo';\n\n\nvar bar = 'bar';`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      options: [{ count: 2 }],
    },
    {
      code: `import foo from 'foo';\n\n\nvar bar = 'bar';`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      options: [{ count: 2, exactCount: true }],
    },
    {
      code: `import foo from 'foo';\n\nvar bar = 'bar';`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      options: [{ count: 1, exactCount: true }],
    },
    {
      code: `import foo from 'foo';\n\n// Some random comment\nvar bar = 'bar';`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      options: [{ count: 2, exactCount: true }],
    },
    {
      code: `import foo from 'foo';\n// Some random comment\nvar bar = 'bar';`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      options: [{ count: 1, exactCount: true }],
    },
    {
      code: `import foo from 'foo';\n\n\n// Some random comment\nvar bar = 'bar';`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      options: [{ count: 2, exactCount: true, considerComments: true }],
    },
    {
      code: `import foo from 'foo';\n\n// Some random comment\nvar bar = 'bar';`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      options: [{ count: 1, exactCount: true, considerComments: true }],
    },
    {
      code: `/**\n * A leading comment\n */\nimport foo from 'foo';\n\n// Some random comment\nexport {foo};`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      options: [{ count: 2, exactCount: true }],
    },
    {
      code: `import foo from 'foo';\n\n\nvar bar = 'bar';`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      options: [{ count: 1 }],
    },
    {
      code: `import foo from 'foo';\n\n\n\n\nvar bar = 'bar';`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      options: [{ count: 4 }],
    },
    {
      code: `var foo = require('foo-module');\n\nvar foo = 'bar';`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `var foo = require('foo-module');\n\n\nvar foo = 'bar';`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      options: [{ count: 2 }],
    },
    {
      code: `var foo = require('foo-module');\n\n\n\n\nvar foo = 'bar';`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      options: [{ count: 4 }],
    },
    {
      code: `var foo = require('foo-module');\n\n\n\n\nvar foo = 'bar';`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      options: [{ count: 4, exactCount: true }],
    },
    {
      code: `var foo = require('foo-module');\n\n// Some random comment\n\n\nvar foo = 'bar';`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      options: [{ count: 4, exactCount: true }],
    },
    {
      code: `var foo = require('foo-module');\n\n\n\n// Some random comment\nvar foo = 'bar';`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      options: [{ count: 4, exactCount: true, considerComments: true }],
    },
    {
      code: `require('foo-module');\n\nvar foo = 'bar';`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `import foo from 'foo';\nimport { bar } from './bar-lib';`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `import foo from 'foo';\n\nvar a = 123;\n\nimport { bar } from './bar-lib';`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `var foo = require('foo-module');\n\nvar a = 123;\n\nvar bar = require('bar-lib');`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `
        function foo() {
          var foo = require('foo');
          foo();
        }
      `,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `
        if (true) {
          var foo = require('foo');
          foo();
        }
      `,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `
        function a() {
          var assign = Object.assign || require('object-assign');
          var foo = require('foo');
          var bar = 42;
        }
      `,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `//issue 592
        export default
        @SomeDecorator(require('./some-file'))
        class App {}
      `,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      parser: parsers.BABEL,
    },
    {
      code: `var foo = require('foo');\n\n@SomeDecorator(foo)\nclass Foo {}`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      parser: parsers.BABEL,
    },
    {
      code: `// issue 1004\nimport foo from 'foo';\n\n@SomeDecorator(foo)\nexport default class Test {}`,
      parserOptions: { sourceType: 'module' },
      parser: parsers.BABEL,
    },
    {
      code: `// issue 1004\nconst foo = require('foo');\n\n@SomeDecorator(foo)\nexport default class Test {}`,
      parserOptions: { sourceType: 'module' },
      parser: parsers.BABEL,
    },

    {
      code: `
        import { ExecaReturnValue } from 'execa';
        import execa = require('execa');
      `,
      parser: parsers.TS,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `
        import execa = require('execa');
        import { ExecaReturnValue } from 'execa';
      `,
      parser: parsers.TS,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `
        import { ExecaReturnValue } from 'execa';
        import execa = require('execa');
        import { ExecbReturnValue } from 'execb';
      `,
      parser: parsers.TS,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `
        import execa = require('execa');
        import { ExecaReturnValue } from 'execa';
        import execb = require('execb');
      `,
      parser: parsers.TS,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `
        export import a = obj;\nf(a);
      `,
      parser: parsers.TS,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `
        import { a } from "./a";

        export namespace SomeNamespace {
            export import a2 = a;
            f(a);
        }`,
      parser: parsers.TS,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `
        import stub from './stub';

        export {
            stub
        }
      `,
      parser: parsers.TS,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `
      import { ns } from 'namespace';
      import Bar = ns.baz.foo.Bar;

      export import Foo = ns.baz.bar.Foo;
    `,
      parser: parsers.TS,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },

    {
      code: `
        import stub from './stub';

        export {
            stub
        }
      `,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `
        import path from 'path';
        import foo from 'foo';
        /**
         * some multiline comment here
         * another line of comment
        **/
        var bar = 42;
      `,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `
        import path from 'path';import foo from 'foo';

        /**
         * some multiline comment here
         * another line of comment
        **/
        var bar = 42;
      `,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      options: [{ considerComments: true }],
    },
    {
      code: `
        import path from 'path';
        import foo from 'foo';

        // Some random single line comment
        var bar = 42;
      `,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
  ],

  invalid: [
    {
      code: `
        import { A, B, C, D } from
        '../path/to/my/module/in/very/far/directory'
        // some comment
        var foo = 'bar';
      `,
      output: `
        import { A, B, C, D } from
        '../path/to/my/module/in/very/far/directory'

        // some comment
        var foo = 'bar';
      `,
      errors: [
        {
          line: 3,
          column: 1,
          ...IMPORT_ERROR,
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      options: [{ considerComments: true }],
    },
    {
      code: `
        import path from 'path';
        import foo from 'foo';
        /**
         * some multiline comment here
         * another line of comment
        **/
        var bar = 42;
      `,
      output: `
        import path from 'path';
        import foo from 'foo';\n
        /**
         * some multiline comment here
         * another line of comment
        **/
        var bar = 42;
      `,
      errors: [
        {
          line: 3,
          column: 9,
          ...IMPORT_ERROR,
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      options: [{ considerComments: true }],
    },
    {
      code: `
        import path from 'path';
        import foo from 'foo';
        // Some random single line comment
        var bar = 42;
      `,
      output: `
        import path from 'path';
        import foo from 'foo';\n
        // Some random single line comment
        var bar = 42;
      `,
      errors: [
        {
          line: 3,
          column: 9,
          ...IMPORT_ERROR,
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      options: [{ considerComments: true, count: 1 }],
    },
    {
      code: `import foo from 'foo';\nexport default function() {};`,
      output: `import foo from 'foo';\n\nexport default function() {};`,
      errors: [
        {
          line: 1,
          column: 1,
          ...IMPORT_ERROR,
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `import foo from 'foo';\n\nexport default function() {};`,
      output: `import foo from 'foo';\n\n\nexport default function() {};`,
      options: [{ count: 2 }],
      errors: [
        {
          line: 1,
          column: 1,
          ...getImportError(2),
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `var foo = require('foo-module');\nvar something = 123;`,
      output: `var foo = require('foo-module');\n\nvar something = 123;`,
      errors: [
        {
          line: 1,
          column: 1,
          ...REQUIRE_ERROR,
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `import foo from 'foo';\nexport default function() {};`,
      output: `import foo from 'foo';\n\nexport default function() {};`,
      options: [{ count: 1 }],
      errors: [
        {
          line: 1,
          column: 1,
          ...IMPORT_ERROR,
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `import foo from 'foo';\nvar a = 123;\n\nimport { bar } from './bar-lib';\nvar b=456;`,
      output: `import foo from 'foo';\n\nvar a = 123;\n\nimport { bar } from './bar-lib';\n\nvar b=456;`,
      errors: [
        {
          line: 1,
          column: 1,
          ...IMPORT_ERROR,
        },
        {
          line: 4,
          column: 1,
          ...IMPORT_ERROR,
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `var foo = require('foo-module');\nvar a = 123;\n\nvar bar = require('bar-lib');\nvar b=456;`,
      output: `var foo = require('foo-module');\n\nvar a = 123;\n\nvar bar = require('bar-lib');\n\nvar b=456;`,
      errors: [
        {
          line: 1,
          column: 1,
          ...REQUIRE_ERROR,
        },
        {
          line: 4,
          column: 1,
          ...REQUIRE_ERROR,
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `var foo = require('foo-module');\nvar a = 123;\n\nrequire('bar-lib');\nvar b=456;`,
      output: `var foo = require('foo-module');\n\nvar a = 123;\n\nrequire('bar-lib');\n\nvar b=456;`,
      errors: [
        {
          line: 1,
          column: 1,
          ...REQUIRE_ERROR,
        },
        {
          line: 4,
          column: 1,
          ...REQUIRE_ERROR,
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `var path = require('path');\nvar foo = require('foo');\nvar bar = 42;`,
      output: `var path = require('path');\nvar foo = require('foo');\n\nvar bar = 42;`,
      errors: [
        {
          line: 2,
          column: 1,
          ...REQUIRE_ERROR,
        },
      ],
    },
    {
      code: `var assign = Object.assign || require('object-assign');\nvar foo = require('foo');\nvar bar = 42;`,
      output: `var assign = Object.assign || require('object-assign');\nvar foo = require('foo');\n\nvar bar = 42;`,
      errors: [
        {
          line: 2,
          column: 1,
          ...REQUIRE_ERROR,
        },
      ],
    },
    {
      code: `require('a');\nfoo(require('b'), require('c'), require('d'));\nrequire('d');\nvar foo = 'bar';`,
      output: `require('a');\nfoo(require('b'), require('c'), require('d'));\nrequire('d');\n\nvar foo = 'bar';`,
      errors: [
        {
          line: 3,
          column: 1,
          ...REQUIRE_ERROR,
        },
      ],
    },
    {
      code: `require('a');\nfoo(\nrequire('b'),\nrequire('c'),\nrequire('d')\n);\nvar foo = 'bar';`,
      output: `require('a');\nfoo(\nrequire('b'),\nrequire('c'),\nrequire('d')\n);\n\nvar foo = 'bar';`,
      errors: [
        {
          line: 6,
          column: 1,
          ...REQUIRE_ERROR,
        },
      ],
    },
    {
      code: `import path from 'path';\nimport foo from 'foo';\nvar bar = 42;`,
      output: `import path from 'path';\nimport foo from 'foo';\n\nvar bar = 42;`,
      errors: [
        {
          line: 2,
          column: 1,
          ...IMPORT_ERROR,
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `import path from 'path';import foo from 'foo';var bar = 42;`,
      output: `import path from 'path';import foo from 'foo';\n\nvar bar = 42;`,
      errors: [
        {
          line: 1,
          column: 25,
          ...IMPORT_ERROR,
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `import foo from 'foo';\n@SomeDecorator(foo)\nclass Foo {}`,
      output: `import foo from 'foo';\n\n@SomeDecorator(foo)\nclass Foo {}`,
      errors: [
        {
          line: 1,
          column: 1,
          ...IMPORT_ERROR,
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      parser: parsers.BABEL,
    },
    {
      code: `var foo = require('foo');\n@SomeDecorator(foo)\nclass Foo {}`,
      output: `var foo = require('foo');\n\n@SomeDecorator(foo)\nclass Foo {}`,
      errors: [
        {
          line: 1,
          column: 1,
          ...REQUIRE_ERROR,
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      parser: parsers.BABEL,
    },
    {
      code: `// issue 10042\nimport foo from 'foo';\n@SomeDecorator(foo)\nexport default class Test {}`,
      output: `// issue 10042\nimport foo from 'foo';\n\n@SomeDecorator(foo)\nexport default class Test {}`,
      errors: [
        {
          line: 2,
          column: 1,
          ...IMPORT_ERROR,
        },
      ],
      parserOptions: { sourceType: 'module' },
      parser: parsers.BABEL,
    },
    {
      code: `// issue 1004\nconst foo = require('foo');\n@SomeDecorator(foo)\nexport default class Test {}`,
      output: `// issue 1004\nconst foo = require('foo');\n\n@SomeDecorator(foo)\nexport default class Test {}`,
      errors: [
        {
          line: 2,
          column: 1,
          ...REQUIRE_ERROR,
        },
      ],
      parserOptions: { sourceType: 'module' },
      parser: parsers.BABEL,
    },
    {
      code: `
        // issue 1784
        import { map } from 'rxjs/operators';
        @Component({})
        export class Test {}
      `,
      output: `
        // issue 1784
        import { map } from 'rxjs/operators';

        @Component({})
        export class Test {}
      `,
      errors: [
        {
          line: 3,
          column: 9,
          ...IMPORT_ERROR,
        },
      ],
      parserOptions: { sourceType: 'module' },
      parser: parsers.BABEL,
    },
    {
      code: `import foo from 'foo';\n\nexport default function() {};`,
      output: `import foo from 'foo';\n\n\nexport default function() {};`,
      options: [{ count: 2, exactCount: true }],
      errors: [
        {
          line: 1,
          column: 1,
          ...getImportError(2),
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `import foo from 'foo';\n\n\n\nexport default function() {};`,
      output: `import foo from 'foo';\n\n\n\nexport default function() {};`,
      options: [{ count: 2, exactCount: true }],
      errors: [
        {
          line: 1,
          column: 1,
          ...getImportError(2),
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `import foo from 'foo';\n\n\n\n\nexport default function() {};`,
      output: `import foo from 'foo';\n\n\n\n\nexport default function() {};`,
      options: [{ count: 2, exactCount: true }],
      errors: [
        {
          line: 1,
          column: 1,
          ...getImportError(2),
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `import foo from 'foo';\n// some random comment\nexport default function() {};`,
      output: `import foo from 'foo';\n\n// some random comment\nexport default function() {};`,
      options: [{ count: 2, exactCount: true }],
      errors: [
        {
          line: 1,
          column: 1,
          ...getImportError(2),
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `import foo from 'foo';\n// some random comment\n\n\nexport default function() {};`,
      output: `import foo from 'foo';\n// some random comment\n\n\nexport default function() {};`,
      options: [{ count: 2, exactCount: true }],
      errors: [
        {
          line: 1,
          column: 1,
          ...getImportError(2),
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `import foo from 'foo';\n// some random comment\n\n\n\nexport default function() {};`,
      output: `import foo from 'foo';\n// some random comment\n\n\n\nexport default function() {};`,
      options: [{ count: 2, exactCount: true }],
      errors: [
        {
          line: 1,
          column: 1,
          ...getImportError(2),
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `import foo from 'foo';\n// some random comment\nexport default function() {};`,
      output: `import foo from 'foo';\n\n\n// some random comment\nexport default function() {};`,
      options: [{ count: 2, exactCount: true, considerComments: true }],
      errors: [
        {
          line: 1,
          column: 1,
          ...getImportError(2),
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `import foo from 'foo';\n\n// some random comment\nexport default function() {};`,
      output: `import foo from 'foo';\n\n\n// some random comment\nexport default function() {};`,
      options: [{ count: 2, exactCount: true, considerComments: true }],
      errors: [
        {
          line: 1,
          column: 1,
          ...getImportError(2),
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `import foo from 'foo';\n\n\n\n// some random comment\nexport default function() {};`,
      output: `import foo from 'foo';\n\n\n\n// some random comment\nexport default function() {};`,
      options: [{ count: 2, exactCount: true, considerComments: true }],
      errors: [
        {
          line: 1,
          column: 1,
          ...getImportError(2),
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `
        import foo from 'foo';


        // Some random single line comment
        var bar = 42;
      `,
      output: `
        import foo from 'foo';


        // Some random single line comment
        var bar = 42;
      `,
      errors: [
        {
          line: 2,
          column: 9,
          ...IMPORT_ERROR,
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
      options: [{ considerComments: true, count: 1, exactCount: true }],
    },
    {
      code: `import foo from 'foo';export default function() {};`,
      output: `import foo from 'foo';\n\nexport default function() {};`,
      options: [{ count: 1, exactCount: true }],
      errors: [
        {
          line: 1,
          column: 1,
          ...IMPORT_ERROR,
        },
      ],
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `const foo = require('foo');\n\n\n\nconst bar = function() {};`,
      output: `const foo = require('foo');\n\n\n\nconst bar = function() {};`,
      options: [{ count: 2, exactCount: true }],
      errors: [
        {
          line: 1,
          column: 1,
          ...getRequireError(2),
        },
      ],
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: `const foo = require('foo');\n\n\n\n// some random comment\nconst bar = function() {};`,
      output: `const foo = require('foo');\n\n\n\n// some random comment\nconst bar = function() {};`,
      options: [{ count: 2, exactCount: true }],
      errors: [
        {
          line: 1,
          column: 1,
          ...getRequireError(2),
        },
      ],
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: `import foo from 'foo';// some random comment\nexport default function() {};`,
      output: `import foo from 'foo';\n\n// some random comment\nexport default function() {};`,
      options: [{ count: 1, exactCount: true, considerComments: true }],
      errors: [
        {
          line: 1,
          column: 1,
          ...IMPORT_ERROR,
        },
      ],
      parserOptions: {
        ecmaVersion: 2015,
        considerComments: true,
        sourceType: 'module',
      },
    },
    {
      code: `const foo = require('foo');\n\n\n// some random comment\nconst bar = function() {};`,
      output: null,
      options: [{ count: 2, exactCount: true, considerComments: true }],
      errors: [
        {
          line: 1,
          column: 1,
          ...getRequireError(2),
        },
      ],
      parserOptions: { ecmaVersion: 2015 },
    },
  ],
})
