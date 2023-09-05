import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'PainelIndicadoresWebPartStrings';
import PainelIndicadores from './components/PainelIndicadores';
import { IPainelIndicadoresProps } from './components/IPainelIndicadoresProps';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';

// require('../../../node_modules/bootstrap/dist/css/bootstrap.min.css')

export interface IPainelIndicadoresWebPartProps {
  description: string;
  collectionData: any[];
}

export default class PainelIndicadoresWebPart extends BaseClientSideWebPart<IPainelIndicadoresWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IPainelIndicadoresProps> = React.createElement(
      PainelIndicadores,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        collectionData: this.properties.collectionData
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              throw new Error('Unknown host');
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: "Propriedades da WebPart",
              groupFields: [
                PropertyPaneTextField('description', {
                  label: "Título"
                }),
                PropertyFieldCollectionData("collectionData", {
                  key: "collectionData",
                  label: "Indicadores",
                  panelHeader: "Adicionar Indicadores",
                  manageBtnLabel: "Adicionar Indicadores",
                  value: this.properties.collectionData,
                  fields: [
                    {
                      id: "Title",
                      title: "Título",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "Link",
                      title: "Link do Arquivo",
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: "Alvo",
                      title: "Tipo de Alvo",
                      type: CustomCollectionFieldType.dropdown,
                      options: [
                        {
                          key: "1",
                          text: "Fora do Alvo"
                        },
                        {
                          key: "2",
                          text: "Alvo"
                        },
                        {
                          key: "3",
                          text: "Acima do Alvo"
                        }
                      ],
                      required: true
                    }
                  ],
                  disabled: false
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
