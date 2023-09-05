import * as React from 'react';
import styles from './PainelIndicadores.module.scss';
import { IPainelIndicadoresProps } from './IPainelIndicadoresProps';

require("../../../../node_modules/font-awesome/css/font-awesome.min.css")

export default class PainelIndicadores extends React.Component<IPainelIndicadoresProps, {}> {
  public render(): React.ReactElement<IPainelIndicadoresProps> {
    const {
      description,
      collectionData
    } = this.props;

    return (
      <section id="kpis" className={styles.kpis}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 mx-auto text-center">
              <h2 className={styles.title}>{ description }</h2>
              <hr className={styles.division} />
              <div id="kpisContainer" className={styles.container}>
              {collectionData?.map((item, key) => {
                return (
                  <div key={key} className={styles.kpi} data-depto="TREINAMENTOS">
                    <div className={styles['heading']}>
                      <h4 className={styles.text}>{item.Title}</h4>
                    </div>
                    <div className={styles.body}>
                      <div className="div-valor-kpi div-valor-kpi-peq">
                        <span className={`${styles.alvo} ${ item.Alvo == "1" ?  styles.fora : item.Alvo == "2" ? styles.ok : styles.acima }`}></span>
                      </div>
                    </div>
                    <div className="redirect-kpi text-center">
                      <a href={item.Link} className={styles['btn-cinzinha']}>
                        <i className="fa fa-file-excel-o"></i> Indicador
                      </a>
                    </div>
                  </div>
                )
              })}
              </div>
            </div>
          </div>
          <div id="divLegendasKPI" className={styles.legendas}>
            <div className="col-lg-12 text-center legendas-kpi">
              <h6 className={styles.title}><b>Legendas</b></h6>
              <button type="button" className={styles['btn-kpi-abaixo']}>
                <i className="fa fa-arrow-circle-down"></i> Fora do alvo
              </button>
              <button type="button" className={styles['btn-kpi-alvo']}>
                <i className="fa fa-arrow-circle-right"></i> Alvo
              </button>
              <button type="button" className={styles['btn-kpi-acima']}>
                <i className="fa fa-arrow-circle-up"></i> Acima do alvo
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
