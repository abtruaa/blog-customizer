import { forwardRef } from 'react';
import arrow from 'src/images/arrow.svg';
import clsx from 'clsx';
import styles from './ArrowButton.module.scss';

export type ArrowButtonProps = {
	isOpen: boolean;
	onClick: () => void;
};

export const ArrowButton = forwardRef<HTMLDivElement, ArrowButtonProps>(
	({ isOpen, onClick }, ref) => {
		return (
			<div
				ref={ref}
				role='button'
				aria-label='Открыть/Закрыть форму параметров статьи'
				tabIndex={0}
				className={clsx(styles.container, { [styles.container_open]: isOpen })}
				onClick={onClick}>
				<img
					src={arrow}
					alt='иконка стрелочки'
					className={clsx(styles.arrow, { [styles.arrow_open]: isOpen })}
				/>
			</div>
		);
	}
);

// Добавляем displayName для отладки (хорошая практика)
ArrowButton.displayName = 'ArrowButton';
