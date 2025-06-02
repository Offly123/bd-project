'use client'

import Form from '$/Form'
import TextInput from '$/TextInput'

export default function Login() {
    return (
        <Form action='/api/login' headText='Вход' sendButtonText='Войти' successRedirect='/favorites/' >
            <TextInput label='Логин' type='text' name='user_login'></TextInput>
            <TextInput label='Пароль' type='password' name='user_password'></TextInput>
        </Form>
    )
}
