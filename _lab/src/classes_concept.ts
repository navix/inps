interface User {
  emailAddress: string;
  verification: {
    verified: boolean;
    verificationCode: string;
  }
  activeApps: string[];
}

class InGroup<T extends object> {
  #children: {
    [P in keyof T]: InControl<T[P]>;
  };

  // @todo use args object?
  constructor(children: { [P in keyof T]: InControl<T[P]> }) {
    // @todo deepClone?
    this.#children = children;
  }

  get children() {
    return this.#children;
  }

  // @todo bindModel?
  couple(model: T) {
  }
}

class InControl<T> {
  #def: T;

  #options: any;

  constructor(args: {
    def: T;
    options: any;
  }) {
    this.#def = args.def;
    this.#options = args.options;
  }
}

//
//function inGroup<T extends object>(children: {[P in keyof T]: InControl<T[P]>}): InGroup<T> {
//  return {
//    children,
//  };
//}

type InModelFromGroup<T> = T extends InGroup<infer U> ? { [P in keyof U]: U[P] } : any;

type InControlModel<T> = T;

//function inControl<T>(def: T): InControl<T> {
//  return {
//    def,
//    options: {},
//  };
//}

interface FormModel {
  name: string;
  count: number;
}

const model: FormModel = {
  name: '',
  count: 10,
};

const model2 = {
  name: '',
  count: 10,
  count2: 10,
};

const model3 = {
  name: '',
  count: 10,
  count2: 'cvdsc',
};

//const form = inGroup<FormModel>({
//  name: inControl('kookoo', {}),
//  count: inControl(20, {}),
//});

const clsForm = new InGroup({
  name: new InControl({def: 'kokokoo', options: {}}),
  count: new InControl({def: 20, options: {}}),
});

const clsFormChk = new InGroup({
  name: new InControl({def: 'kokokoo', options: {}}),
  count: new InControl({def: 20, options: {}}),
  count2: new InControl({def: 'miu', options: {}}),
});

const modelOf: InModelFromGroup<typeof clsFormChk> = {
  count: '33',
};

clsFormChk.couple(model);
clsFormChk.couple(model2);
clsFormChk.couple(model3);
clsForm.couple(model);
clsForm.couple(model2);
clsForm.couple(model3);

//inBind(model, checkBindForm);
//
//form.children.name.def = 'hihi';
//form.children.count.def = 33;
// form.children.count.def = '33'; // err
// form.children.meh.def = 333;  // err
