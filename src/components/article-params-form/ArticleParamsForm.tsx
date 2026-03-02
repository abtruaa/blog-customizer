import { FormEvent, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Text } from 'src/ui/text';
import {
	ArticleStateType,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
	OptionType,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	currentState: ArticleStateType;
	onApply: (newState: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	currentState,
	onApply,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [formState, setFormState] = useState<ArticleStateType>(currentState);

	const formRef = useRef<HTMLFormElement>(null);
	const arrowRef = useRef<HTMLDivElement>(null);
	// Синхронизация при открытии
	useEffect(() => {
		if (isOpen) {
			setFormState(currentState);
		}
	}, [isOpen, currentState]);

	// Закрытие по клику вне
	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (
				formRef.current &&
				!formRef.current.contains(event.target as Node) &&
				arrowRef.current &&
				!arrowRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isOpen]);

	// Блокировка скролла
	useEffect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		onApply(formState);
		setIsOpen(false);
	};

	const handleReset = (e: FormEvent) => {
		e.preventDefault();
		setFormState(defaultArticleState);
		onApply(defaultArticleState);
	};

	const updateFormState = (key: keyof ArticleStateType, value: OptionType) => {
		setFormState((prev) => ({ ...prev, [key]: value }));
	};

	return (
		<>
			<ArrowButton
				ref={arrowRef}
				isOpen={isOpen}
				onClick={() => {
					setIsOpen(!isOpen);
				}}
			/>
			{isOpen && (
				<div className={styles.overlay} onClick={() => setIsOpen(false)} />
			)}
			<aside
				className={clsx(styles.container, isOpen && styles.container_open)}>
				<form
					ref={formRef}
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={(e) => {
						e.preventDefault(); // Важно! Предотвращаем стандартный сброс
						setFormState(defaultArticleState);
						onApply(defaultArticleState);
					}}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте параметры
					</Text>

					<Select
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={(option) => updateFormState('fontFamilyOption', option)}
						title='Шрифт'
					/>

					<RadioGroup
						name='fontSize'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={(option) => updateFormState('fontSizeOption', option)}
						title='Размер шрифта'
					/>

					<Select
						selected={formState.fontColor}
						options={fontColors}
						onChange={(option) => updateFormState('fontColor', option)}
						title='Цвет шрифта'
					/>

					<hr className={styles.separator} />

					<Select
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={(option) => updateFormState('backgroundColor', option)}
						title='Цвет фона'
					/>

					<Select
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={(option) => updateFormState('contentWidth', option)}
						title='Ширина контента'
					/>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' type='clear' htmlType='reset' />
						<Button title='Применить' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
