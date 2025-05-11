'use client'

import React, { useState } from 'react';

import { FormData } from '$/Form';

import style from '@/form/radioInput.module.scss';

interface ChildProps {
    [key: string]: any;
}

export default function RadioInput({
    label,
    onChange,
    children
}: {
    label: string,
    onChange?: Function,
    children?: React.ReactNode
}) {

    const [ isChecked, setIsChecked ] = useState(() => {
        let radioButtons = {};
        React.Children.forEach(children, (child: React.ReactElement) => {
            const { name } = child.props as { name: string };
            radioButtons[child[name]] = false;
        });
        return radioButtons;
    });

    const handleChange = (event) => {
        console.log(isChecked);
        const { value } = event.target;
        const newState = {};
        React.Children.forEach(children, (child: React.ReactElement) => {
            const { value } = child.props as { value: string };
            newState[child[value]] = (child.props[value]=== value);
        });
        setIsChecked(newState);
    }

    return (
        <div className={style.radioInput}>
            <label>
                { label }
            </label>
            <div className={style.buttons}>
                {
                    React.Children.map(children, (child: React.ReactElement) => {
                        const { name } = child.props as { name: string };
                        return React.cloneElement<ChildProps>(child, {
                            checked: isChecked[child[name]], 
                            onChange: onChange
                        })
                    })
                }
            </div>
        </div>
    );
}
