import { Lane, ModelComponent, ScopeMeta, Source, Symlink, Version } from './models';

/**
 * Bit Objects types.
 * the object name is retrieved in `typesToObject()` using the `.name` prop of the class.
 * the name is saved into the file as part of the object header. so it can't be changed easily.
 */
export default function types() {
  return [Source, ModelComponent, Version, ScopeMeta, Symlink, Lane];
}

function typesToObject(typesArr: Function[]) {
  return typesArr.reduce((map, objectType) => {
    map[objectType.name] = objectType;
    return map;
  }, {});
}

const typesObj = typesToObject(types());

const typesNames: string[] = Object.keys(typesObj);

export { typesObj, typesToObject, typesNames };
