
import { ValidationResult, Validator, AsyncValidator } from './types'

export { ValidationResult, Validator, AsyncValidator } from './types'

export type EitherValidatorFunction<T> =
SyncValidatorFunction<T> |
  AsyncValidatorFunction<T>

export interface SyncValidatorFunction<T> {
  (value: T): string | undefined
}

export interface AsyncValidatorFunction<T> {
  (value: T): Promise<string | undefined>
}

export interface ValidatorConfig<T> {
  required: SyncValidatorFunction<T>[]
  optional?: SyncValidatorFunction<T>[]
  minOptional?: number
}

export interface AsyncValidatorConfig<T> {
  required: EitherValidatorFunction<T>[]
  optional?: EitherValidatorFunction<T>[]
  minOptional?: number
}

export function mergeResults (...results: ValidationResult[]): ValidationResult {
  return results.reduce((acc, current) => {
    return {
      errors: acc.errors.concat(current.errors),
      warnings: acc.warnings.concat(current.warnings),
      passes: acc.passes && current.passes,
    }
  })
}

export function makeValidator<T> (config: ValidatorConfig<T>): Validator<T> {
  const { required, optional = [], minOptional = 0 } = config

  return (value: T) => {
    const errors = runValidators(value, required)
    const warnings = runValidators(value, optional)
    const passes = errors.length === 0 && warnings.length <= minOptional

    return {
      errors,
      warnings,
      passes,
    }
  }
}

export function makeAsyncValidator<T> (config: AsyncValidatorConfig<T>): AsyncValidator<T> {
  const { required, optional = [], minOptional = 0 } = config

  return async (value: T) => {
    const [errors, warnings] = await Promise.all([
      runAsyncValidators(value, required),
      runAsyncValidators(value, optional),
    ])

    const passes = errors.length === 0 && warnings.length <= minOptional

    return {
      errors,
      warnings,
      passes,
    }
  }
}

function runValidators<T> (value: T, validators: SyncValidatorFunction<T>[]): string[] {
  return validators
    .map(validate => validate(value))
    .filter(err => err !== undefined) as string[]
}

async function runAsyncValidators<T> (value: T, validators: EitherValidatorFunction<T>[]): Promise<string[]> {
  const values = await Promise.all(
    validators.map(validate => validate(value)),
  )

  return values.filter(err => err !== undefined) as string[]
}
