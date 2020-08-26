interface Group<T extends object> {
  children: { [P in keyof T]: T[P] };
}

type GroupNodeDecl<T> = T | GroupController<T> | ControlController<T>;

type GroupDecl<T> = {
  [P in keyof T]: GroupNodeDecl<T[P]>;
}

type GroupDeclFn<T> = (model: T) => GroupDecl<T>;

type ExtractModelFromDecl<T> = T extends ControlDecl<infer U> ? U
  : T extends GroupDecl<infer U>
    ? U : unknown;

type ExtractModelFromDecl2<T> = T extends GroupController<infer U> ? { [P in keyof U]: U[P] } : any;

interface ControlDecl<T> {
  def: T;
  validators?: any;
}

interface GroupController<T> {
  decl: GroupDecl<T> | GroupDeclFn<T>;
}

interface ControlController<T> {
  decl: ControlDecl<T>;
}

function group<T>(decl: GroupDecl<T> | GroupDeclFn<T>): GroupController<T> {
  return {
    decl,
  };
}

function control<T>(decl: ControlDecl<T>): ControlController<T> {
  return {
    decl,
  };
}

//const dynConcept = group({
//  checked: control({def: true}),
//  checked2: control({def: true}),
//  additional: m => m.checked ? control({
//    def: '',
//    validators: {
//      required: m.checked2,
//    },
//  }) : undefined,
//});

interface ConModel {
  checked: boolean;
  checked2: boolean;
  additional?: string;
}

const dynConcept3 = group<ConModel>(m => ({
  checked: control({def: true}),
  checked2: control({def: true}),
  additional: m.checked2 ? control({
    def: '',
    validators: {
      required: m.checked2,
    },
  }) : undefined,
}));

//const emodel: ExtractModelFromDecl2<typeof dynConcept> = {
//  checked: false,
//  additional: false,
//};

interface ParteyModel {
  type: 'full' | 'partial';
  checked: boolean;
}

interface FullParteyModel extends ParteyModel {
  type: 'full';
  content1: string;
  content2: string;
}

const parteyForm = group<FullParteyModel>({
  type: 'full',
  checked: control({def: false}),
  content1: control({def: ''}),
  content2: control({def: ''}),
});

interface NestyModel {
  checked: boolean;
  nested: {
    content1: string;
    content2: string;
    subNest: {
      content5: string;
      content6?: string;
    };
  };
  nestedCond?: {
    content3: string;
    content4: string;
  };
}

const nestyForm = group<NestyModel>(m => ({
  checked: control({
    def: false,
    validators: {
      // error-prone here
      kek: m.nested.subNest.content6,
    },
  }),
  nested: group({
    content1: control({def: ''}),
    content2: '123',
    subNest: {
      content5: '321',
    },
  }),
}));

export type DeepPartial<T> = T extends Function ? T : (T extends object ? { [P in keyof T]?: DeepPartial<T[P]>; } : T);

/**
 * Fix model with form defaults.
 */
function fixModel<T>(form: GroupController<T>, model: DeepPartial<T>): T {
  let decl: GroupDecl<T> = typeof form.decl === 'function' ? form.decl(model) : form.decl;
}

//function iterateGroup<T>(group: GroupController<T>, fn: ())

// @todo validators
// @todo async validators
// @todo coupling
