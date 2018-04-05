
export interface ValidationResult {
  errors: string[]
  warnings: string[]
  passes: boolean
}

export interface Validator<T> {
  (target: T): ValidationResult
}

export interface ValidatorWithOptions<T, O> {
  (target: T, options?: O): ValidationResult
}

export interface ValidatorWithRequiredOptions<T, O> {
  (target: T, options: O): ValidationResult
}

export interface AsyncValidator<T> {
  (target: T): Promise<ValidationResult>
}
