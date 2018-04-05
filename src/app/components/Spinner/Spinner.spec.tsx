
import * as React from 'react'
import { create } from 'react-test-renderer'
import { shallow } from 'enzyme'

import Spinner from './Spinner'

describe(`<${Spinner.name} />`, () => {
  describe('shapshots', () => {
    it('should render', () => {
      const element = create((
        <Spinner />
      ))

      expect(element).toMatchSnapshot()
    })

    it('should render with the given className', () => {
      const element = create((
        <Spinner className='myClass' />
      ))

      expect(element).toMatchSnapshot()
    })

    it('should render with the given style', () => {
      const element = create((
        <Spinner style={{ top: 0, left: 0, right: 0, bottom: 0 }} />
      ))

      expect(element).toMatchSnapshot()
    })
  })
})
