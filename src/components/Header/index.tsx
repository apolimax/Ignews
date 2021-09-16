import React from 'react';
import Link from 'next/link';

import { ActiveLink } from '../ActiveLink';
import { SigninButton } from '../SigninButton'
import styles from './styles.module.scss'

export function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/">
                    <img src="/images/logo.svg" alt="ig.news" />
                </Link>
                <nav>
                    <ActiveLink activeClassName={styles.active} href='/'>
                        <a>Home</a>
                    </ActiveLink>
                    <ActiveLink activeClassName={styles.active} href='/posts'>
                        <a>Posts</a>
                    </ActiveLink>
                </nav>
                <SigninButton />
            </div>
        </header>
    )
}