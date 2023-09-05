import * as React from 'react';
import styles from './Missao.module.scss';
import { IMissaoProps } from './IMissaoProps';

export default class Missao extends React.Component<IMissaoProps, {}> {
  public render(): React.ReactElement<IMissaoProps> {
    const { titulo, description } = this.props;

    return (
      <section>
        <div className={styles.container}>
            <div className="row">
               <div className={styles.conteudo}>
                  <h2 className={styles.titulo}>{ titulo }</h2>
                  <hr className={styles['my-4']} />
                  <p className={styles.texto}>{ description }</p>
               </div>
            </div>
         </div>
      </section>
    );
  }
}
