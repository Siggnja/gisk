import { BlitzPage, useRouterQuery, Link, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import { ResetPassword } from "app/auth/validations"
import resetPassword from "app/auth/mutations/resetPassword"
import React from "react"
import { Text } from "@chakra-ui/layout"
import { Container } from "@chakra-ui/react"

const ResetPasswordPage: BlitzPage = () => {
  const query = useRouterQuery()
  const [resetPasswordMutation, { isSuccess }] = useMutation(resetPassword)

  return (
    <Container centerContent>
      <Text fontSize="3xl" textAlign="center" as="b">
        Forgot your password?
      </Text>

      {isSuccess ? (
        <div>
          <h2>Password Reset Successfully</h2>
          <p>
            Go to the <Link href="/">homepage</Link>
          </p>
        </div>
      ) : (
        <Form
          submitText="Reset Password"
          schema={ResetPassword.refine((x) => ({
            password: x.password,
            passwordConfirmation: x.passwordConfirmation,
          }))}
          initialValues={{ password: "", passwordConfirmation: "" }}
          onSubmit={async (values) => {
            try {
              await resetPasswordMutation({ ...values, token: query.token as string })
            } catch (error) {
              if (error.name === "ResetPasswordError") {
                return {
                  [FORM_ERROR]: error.message,
                }
              } else {
                return {
                  [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                }
              }
            }
          }}
        >
          <LabeledTextField name="password" label="New Password" type="password" />
          <LabeledTextField
            name="passwordConfirmation"
            label="Confirm New Password"
            type="password"
          />
        </Form>
      )}
    </Container>
  )
}

ResetPasswordPage.redirectAuthenticatedTo = "/"
ResetPasswordPage.getLayout = (page) => (
  <Layout isAuth title="Reset Your Password">
    {page}
  </Layout>
)

export default ResetPasswordPage
