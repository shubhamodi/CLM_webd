import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import styles from './FAQ.module.css';
import data from '../constants';
// import downArrow from '../../public/icon-arrow-down.svg?url';

function FAQ({ idx }) {
  return (
    <Accordion.Root type="single" collapsible={true}>
      {data[idx].map(({ id, question, answer }) => (
        <Accordion.Item className={styles.item} key={id} value={id}>
          <Accordion.Header>
            <Accordion.Trigger className={styles.trigger}>
              {question}
              <img className={styles.svg}  alt="" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.content}>{answer}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

export default FAQ;
