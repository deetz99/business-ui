import { describe, it, expect, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises, VueWrapper } from '@vue/test-utils'
import { FormAddBusinessBase } from '#components'
import { enI18n } from '~~/tests/mocks/i18n'

const testProps: any = {
  authOptions: [],
  contactEmail: 'test@email.com',
  identifier: '1234567890',
  accounts: [],
  businessDetails: {
    isFirm: false,
    isCorporation: false,
    isBenefit: false,
    isCoop: false,
    name: 'Business Name',
    identifier: '1234567890'
  }
}

function mountComp (props = testProps) {
  return mountSuspended(FormAddBusinessBase, {
    props,
    global: {
      plugins: [enI18n]
    }
  })
}

describe('<FormAddBusinessBase />', () => {
  let wrapper: VueWrapper

  const findAllButtons = () => wrapper.findAll('button')
  const findNoOptionAlert = () => wrapper.find('[data-testid="no-option-alert"]')
  const submitForm = async () => {
    const form = wrapper.find('form') // must submit form manually
    await form.trigger('submit.prevent')
    await flushPromises()
  }
  const findRadioButton = (value: string) => wrapper.find(`input[type="radio"][value="${value}"]`)
  const selectAuthOption = async (value: string) => {
    const radio = findRadioButton(value)
    await radio.setValue(value)
    await radio.trigger('change')
    await flushPromises()
  }
  const findFormGroup = (groupid: string) => wrapper.find(`[data-testid="formgroup-${groupid}"]`)

  afterEach(() => {
    wrapper.unmount()
  })

  it('should mount', async () => {
    wrapper = await mountComp()
    expect(wrapper).toBeTruthy()
    expect(wrapper.find('legend').text()).toBe(enI18n.global.t('form.manageBusiness.legend'))

    const buttons = findAllButtons()
    expect(buttons.length).toBeGreaterThanOrEqual(3) // help button + cancel + submit

    const cancelButton = wrapper.findAll('button[type="button"]').find(btn => btn.text() === enI18n.global.t('btn.cancel'))
    expect(cancelButton).toBeTruthy()
    expect(cancelButton?.text()).toBe(enI18n.global.t('btn.cancel'))

    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.exists()).toBe(true)
    expect(submitButton.text()).toBe(enI18n.global.t('form.manageBusiness.submitBtn'))
  })

  describe('Accordian options', () => {
    it('should display no options when auth options is empty', async () => {
      wrapper = await mountComp()
      expect(findAllButtons()).toHaveLength(3) // help button + cancel + submit buttons
    })

    it('should display passcode option', async () => {
      const props = {
        ...testProps,
        authOptions: [{ label: 'Passcode Button Label', slot: 'passcode-option' }]
      }
      wrapper = await mountComp(props)
      const buttons = findAllButtons()
      expect(buttons).toHaveLength(3) // help button + cancel + submit (single option auto-selected, no radio shown)

      // should have passcode label (no radio button for single option)
      expect(wrapper.text()).toContain('Passcode Button Label')
    })

    it('should display firm option', async () => {
      const props = {
        ...testProps,
        authOptions: [{ label: 'Firm Button Label', slot: 'firm-option' }]
      }
      wrapper = await mountComp(props)
      const buttons = findAllButtons()
      expect(buttons).toHaveLength(3) // help button + cancel + submit (single option auto-selected, no radio shown)

      // should have firm label (no radio button for single option)
      expect(wrapper.text()).toContain('Firm Button Label')
    })

    it('should display email option', async () => {
      const props = {
        ...testProps,
        authOptions: [{ label: 'Email Button Label', slot: 'email-option' }]
      }
      wrapper = await mountComp(props)
      const buttons = findAllButtons()
      expect(buttons).toHaveLength(3) // help button + cancel + submit (single option auto-selected, no radio shown)

      // should have email label (no radio button for single option)
      expect(wrapper.text()).toContain('Email Button Label')
    })

    it('should display delegation option', async () => {
      const props = {
        ...testProps,
        authOptions: [{ label: 'Delegation Button Label', slot: 'delegation-option' }]
      }
      wrapper = await mountComp(props)
      const buttons = findAllButtons()
      expect(buttons).toHaveLength(4) // help button + cancel + submit + account select dropdown (single option auto-selected, no radio shown)

      // should have delegation label (no radio button for single option)
      expect(wrapper.text()).toContain('Delegation Button Label')
    })

    it('should display multiple options', async () => {
      const props = {
        ...testProps,
        authOptions: [
          { label: 'Passcode Button Label', slot: 'passcode-option' },
          { label: 'Firm Button Label', slot: 'firm-option' },
          { label: 'Email Button Label', slot: 'email-option' }
        ]
      }
      wrapper = await mountComp(props)
      const buttons = findAllButtons()
      expect(buttons).toHaveLength(3) // help button + cancel + submit (radio buttons are inputs, not buttons)

      // should have radio buttons for multiple options
      expect(findRadioButton('passcode-option').exists()).toBe(true)
      expect(findRadioButton('firm-option').exists()).toBe(true)
      expect(findRadioButton('email-option').exists()).toBe(true)

      // should have option labels
      expect(wrapper.text()).toContain('Passcode Button Label')
      expect(wrapper.text()).toContain('Firm Button Label')
      expect(wrapper.text()).toContain('Email Button Label')
    })
  })

  describe('No option selected alert', () => {
    it('should not show the alert initially and show after submit without opening an accordion item', async () => {
      const props = {
        ...testProps,
        authOptions: [
          { label: 'Passcode Button Label', slot: 'passcode-option' },
          { label: 'Firm Button Label', slot: 'firm-option' },
          { label: 'Email Button Label', slot: 'email-option' }
        ]
      }
      wrapper = await mountComp(props)

      // alert should not be visible initially
      expect(findNoOptionAlert().exists()).toBe(false)

      await submitForm()

      expect(findNoOptionAlert().exists()).toBe(true)
      expect(findNoOptionAlert().text()).toContain(enI18n.global.t('form.manageBusiness.noOptionAlert'))
    })

    it('should hide the alert if shown after selecting an auth option', async () => {
      const props = {
        ...testProps,
        authOptions: [
          { label: 'Passcode Button Label', slot: 'passcode-option' },
          { label: 'Firm Button Label', slot: 'firm-option' },
          { label: 'Email Button Label', slot: 'email-option' }
        ]
      }
      wrapper = await mountComp(props)

      // alert should not be visible initially
      expect(findNoOptionAlert().exists()).toBe(false)

      await submitForm()

      expect(findNoOptionAlert().exists()).toBe(true) // should show alert
      expect(findNoOptionAlert().text()).toContain(enI18n.global.t('form.manageBusiness.noOptionAlert'))

      await selectAuthOption('passcode-option') // select a radio option

      expect(findNoOptionAlert().exists()).toBe(false) // alert should now be hidden
    })
  })

  describe('Form Fields And Validation', () => {
    describe('Passcode option', () => {
      describe('As Coop business', () => {
        it('should display correct attributes and validation messages', async () => {
          const props = {
            ...testProps,
            authOptions: [{ label: 'Passcode Button Label', slot: 'passcode-option' }],
            businessDetails: {
              ...testProps.businessDetails,
              isCoop: true
            }
          }
          wrapper = await mountComp(props)

          // Option is auto-selected for single option

          expect(findFormGroup('passcode-input').exists()).toBe(true)
          expect(findFormGroup('passcode-input').text()).toContain(enI18n.global.t('form.manageBusiness.authOption.passcode.fields.passcode.help.coop'))

          const input = wrapper.find('input[name="passcode"]')
          expect(input.attributes('placeholder')).toEqual(enI18n.global.t('form.manageBusiness.authOption.passcode.fields.passcode.placeholder.coop'))
          expect(input.attributes('aria-label')).toEqual(enI18n.global.t('form.manageBusiness.authOption.passcode.fields.passcode.arialabel.coop'))
          expect(input.attributes('maxlength')).toEqual('9')

          await submitForm()

          expect(findFormGroup('passcode-input').text()).not.toContain(enI18n.global.t('form.manageBusiness.authOption.passcode.fields.passcode.help.coop'))
          expect(findFormGroup('passcode-input').text()).toContain(enI18n.global.t('form.manageBusiness.authOption.passcode.fields.passcode.error.coop.required'))

          await input.setValue('123')
          await input.trigger('blur') // blur required to trigger validation
          await flushPromises()

          expect(findFormGroup('passcode-input').text()).toContain(enI18n.global.t('form.manageBusiness.authOption.passcode.fields.passcode.error.coop.length'))

          await input.setValue('ertertert')
          await input.trigger('blur') // blur required to trigger validation
          await flushPromises()

          expect(findFormGroup('passcode-input').text()).toContain(enI18n.global.t('form.manageBusiness.authOption.passcode.fields.passcode.error.coop.type'))

          await input.setValue('123456789')
          await input.trigger('blur') // blur required to trigger validation
          await flushPromises()

          // should not show any validation errors
          expect(findFormGroup('passcode-input').text()).toContain(enI18n.global.t('form.manageBusiness.authOption.passcode.fields.passcode.help.coop'))
        })
      })

      describe('As other business', () => {
        it('should display correct attributes and validation messages', async () => {
          const props = {
            ...testProps,
            authOptions: [{ label: 'Passcode Button Label', slot: 'passcode-option' }]
          }
          wrapper = await mountComp(props)

          // Option is auto-selected for single option

          expect(findFormGroup('passcode-input').exists()).toBe(true)
          expect(findFormGroup('passcode-input').text()).toContain(enI18n.global.t('form.manageBusiness.authOption.passcode.fields.passcode.help.default'))

          const input = wrapper.find('input[name="passcode"]')
          expect(input.attributes('placeholder')).toEqual(enI18n.global.t('form.manageBusiness.authOption.passcode.fields.passcode.placeholder.default'))
          expect(input.attributes('aria-label')).toEqual(enI18n.global.t('form.manageBusiness.authOption.passcode.fields.passcode.arialabel.default'))
          expect(input.attributes('maxlength')).toEqual('15')

          await submitForm()

          expect(findFormGroup('passcode-input').text()).not.toContain(enI18n.global.t('form.manageBusiness.authOption.passcode.fields.passcode.help.default'))
          expect(findFormGroup('passcode-input').text()).toContain(enI18n.global.t('form.manageBusiness.authOption.passcode.fields.passcode.error.default.required'))

          await input.setValue('123')
          await input.trigger('blur') // blur required to trigger validation
          await flushPromises()

          expect(findFormGroup('passcode-input').text()).toContain(enI18n.global.t('form.manageBusiness.authOption.passcode.fields.passcode.error.default.length'))

          await input.setValue('ertertert')
          await input.trigger('blur') // blur required to trigger validation
          await flushPromises()

          expect(findFormGroup('passcode-input').text()).toContain(enI18n.global.t('form.manageBusiness.authOption.passcode.fields.passcode.error.default.length'))

          await input.setValue('123456789')
          await input.trigger('blur') // blur required to trigger validation
          await flushPromises()

          expect(findFormGroup('passcode-input').text()).toContain(enI18n.global.t('form.manageBusiness.authOption.passcode.fields.passcode.help.default')) // should not show any validation errors
        })
      })
    })

    describe('Firm option', () => {
      describe('Name Input', () => {
        it('should display correct attributes and validation messages', async () => {
          const props = {
            ...testProps,
            authOptions: [{ label: 'Firm Button Label', slot: 'firm-option' }],
            businessDetails: {
              ...testProps.businessDetails,
              isCoop: true
            }
          }
          wrapper = await mountComp(props)

          // Option is auto-selected for single option

          expect(findFormGroup('firm-input').exists()).toBe(true)
          expect(findFormGroup('firm-input').text()).toContain(enI18n.global.t('form.manageBusiness.authOption.firm.fields.name.help'))

          const input = wrapper.find('input[name="partner.name"]')
          expect(input.attributes('placeholder')).toEqual(enI18n.global.t('form.manageBusiness.authOption.firm.fields.name.placeholder'))
          expect(input.attributes('aria-label')).toEqual(enI18n.global.t('form.manageBusiness.authOption.firm.fields.name.arialabel'))

          await submitForm()

          expect(findFormGroup('firm-input').text()).not.toContain(enI18n.global.t('form.manageBusiness.authOption.firm.fields.name.help'))
          expect(findFormGroup('firm-input').text()).toContain(enI18n.global.t('form.manageBusiness.authOption.firm.fields.name.error.required'))

          await input.setValue('Some Name')
          await input.trigger('blur') // blur required to trigger validation
          await flushPromises()

          // should not show any validation errors
          expect(findFormGroup('firm-input').text()).toContain(enI18n.global.t('form.manageBusiness.authOption.firm.fields.name.help'))
        })
      })

      describe('Certification Checkbox', () => {
        it('should display correct attributes and validation messages', async () => {
          const props = {
            ...testProps,
            authOptions: [{ label: 'Firm Button Label', slot: 'firm-option' }]
          }
          wrapper = await mountComp(props)

          // Option is auto-selected for single option

          expect(findFormGroup('firm-checkbox').exists()).toBe(true)

          await submitForm() // trigger validation

          expect(findFormGroup('firm-checkbox').text()).toContain(enI18n.global.t('form.manageBusiness.authOption.firm.fields.certify.error'))

          const checkbox = wrapper.find('input[name="partner.certify"]')
          await checkbox.setValue(true) // set checkbox to true
          await checkbox.trigger('change') // trigger the change event

          await submitForm() // trigger validation

          // should not show validation error
          expect(findFormGroup('firm-checkbox').text()).not.toContain(enI18n.global.t('form.manageBusiness.authOption.firm.fields.certify.error'))
        })
      })
    })

    describe('Email option', () => {
      it('should display correct text as CorpOrBenOrCoop', async () => {
        const props = {
          ...testProps,
          authOptions: [{ label: 'Email Button Label', slot: 'email-option' }],
          businessDetails: {
            ...testProps.businessDetails,
            isCorp: true
          },
          isCorpOrBenOrCoop: true
        }
        wrapper = await mountComp(props)

        // Option is auto-selected for single option

        expect(findFormGroup('email').exists()).toBe(true)
        expect(findFormGroup('email').text()).toContain(enI18n.global.t('form.manageBusiness.authOption.email.sentTo.corpOrBenOrCoop'))
        expect(findFormGroup('email').text()).toContain(testProps.contactEmail)
        expect(findFormGroup('email').text()).toContain(enI18n.global.t('form.manageBusiness.authOption.email.instructions'))
      })

      it('should display correct text as firm', async () => {
        const props = {
          ...testProps,
          authOptions: [{ label: 'Email Button Label', slot: 'email-option' }],
          businessDetails: {
            ...testProps.businessDetails,
            isFirm: true
          }
        }
        wrapper = await mountComp(props)

        // Option is auto-selected for single option

        expect(findFormGroup('email').exists()).toBe(true)
        expect(findFormGroup('email').text()).toContain(enI18n.global.t('form.manageBusiness.authOption.email.sentTo.firm'))
        expect(findFormGroup('email').text()).toContain(testProps.contactEmail)
        expect(findFormGroup('email').text()).toContain(enI18n.global.t('form.manageBusiness.authOption.email.instructions'))
      })

      it('should display correct default text', async () => {
        const props = {
          ...testProps,
          authOptions: [{ label: 'Email Button Label', slot: 'email-option' }]
        }
        wrapper = await mountComp(props)

        // Option is auto-selected for single option

        expect(findFormGroup('email').exists()).toBe(true)
        expect(findFormGroup('email').text()).toContain(enI18n.global.t('form.manageBusiness.authOption.email.sentTo.default'))
        expect(findFormGroup('email').text()).toContain(testProps.contactEmail)
        expect(findFormGroup('email').text()).toContain(enI18n.global.t('form.manageBusiness.authOption.email.instructions'))
      })
    })

    describe('Delegation option', () => {
      describe('Account Select', () => {
        it('should display correct attributes and validation messages', async () => {
          const props = {
            ...testProps,
            authOptions: [{ label: 'Delegation Button Label', slot: 'delegation-option' }],
            accounts: [
              { branchName: 'branch1', name: 'name1', uuid: '123' },
              { branchName: '', name: 'name2', uuid: '456' }
            ]
          }
          wrapper = await mountComp(props)

          // Option is auto-selected for single option

          expect(findFormGroup('delegation-account').exists()).toBe(true)

          await submitForm()

          // should have validation error
          expect(findFormGroup('delegation-account').text()).toContain(enI18n.global.t('form.manageBusiness.authOption.delegation.fields.account.error.required'))

          const selectMenu = wrapper.find('[data-testid="delegation-select-menu"]')
          await selectMenu.trigger('click') // open menu

          const options = wrapper.findAll('li')
          expect(options.length).toBeGreaterThanOrEqual(2) // should have at least 2 options based off 2 accounts

          // Find the account options specifically
          const accountOptions = options.filter(option =>
            option.text().includes('name1') || option.text().includes('name2')
          )
          expect(accountOptions).toHaveLength(2)
          expect(accountOptions[0]?.text()).toContain('name1 - branch1') // should combine branch name on option if exists
          expect(accountOptions[1]?.text()).toContain('name2') // no branch name so name only in option

          await accountOptions[0]?.trigger('click') // click first account option

          expect(selectMenu.text()).toContain('name1 - branch1')
          expect(selectMenu.attributes('aria-label')).toEqual('Select an account: current selection, name1')

          await submitForm() // trigger validation

          // should not have validation error
          expect(findFormGroup('delegation-account').text()).not.toContain(enI18n.global.t('form.manageBusiness.authOption.delegation.fields.account.error.required'))
        })
      })

      describe('Message textarea', () => {
        it('should display correct attributes and validation messages', async () => {
          const props = {
            ...testProps,
            authOptions: [{ label: 'Firm Button Label', slot: 'delegation-option' }]
          }
          wrapper = await mountComp(props)

          // Option is auto-selected for single option

          expect(findFormGroup('delegation-message').exists()).toBe(true)

          const textarea = wrapper.find('textarea')
          expect(textarea).toBeTruthy()
          expect(textarea.attributes('maxlength')).toEqual('400')
        })
      })
    })
  })
})
