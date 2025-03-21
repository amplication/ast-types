import {
  Annotation,
  Class,
  ClassInstantiation,
  ClassReference,
  CodeBlock,
  CoreClassReference,
  Dictionary,
  Enum,
  Field,
  Interface,
  Method,
  MethodInvocation,
  Parameter,
  Type,
  ProgramClass,
} from "../ast";
import { GenericClassReference } from "../ast/GenericClassReference";

export function class_(args: Class.Args): Class {
  return new Class(args);
}

export function annotation(args: Annotation.Args): Annotation {
  return new Annotation(args);
}

export function classReference(args: ClassReference.Args): ClassReference {
  return new ClassReference(args);
}

export function genericClassReference(
  args: GenericClassReference.Args
): GenericClassReference {
  return new GenericClassReference(args);
}

export function instantiateClass(
  args: ClassInstantiation.Args
): ClassInstantiation {
  return new ClassInstantiation(args);
}

export function invokeMethod(args: MethodInvocation.Args): MethodInvocation {
  return new MethodInvocation(args);
}

export function coreClassReference(
  args: CoreClassReference.Args
): CoreClassReference {
  return new CoreClassReference(args);
}

export function codeblock(args: CodeBlock.Args): CodeBlock {
  return new CodeBlock(args);
}

export function field(args: Field.Args): Field {
  return new Field(args);
}

export function method(args: Method.Args): Method {
  return new Method(args);
}

export function parameter(args: Parameter.Args): Parameter {
  return new Parameter(args);
}

export function interface_(args: Interface.Args): Interface {
  return new Interface(args);
}

export function enum_(args: Enum.Args): Enum {
  return new Enum(args);
}

export function dictionary(args: Dictionary.Args): Dictionary {
  return new Dictionary(args);
}
export function programClass(args: ProgramClass.Args): ProgramClass {
  return new ProgramClass(args);
}
export const Types = Type;
