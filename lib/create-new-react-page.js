'use babel';

import CreateNewReactPageView from './create-new-react-page-view';
import { CompositeDisposable } from 'atom';

export default {

  createNewReactPageView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.createNewReactPageView = new CreateNewReactPageView(state.createNewReactPageViewState);

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'create-new-react-page:create-simple': () => this.createSimple(),
      'create-new-react-page:create-pure': () => this.createPure(),
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
    this.createNewReactPageView.destroy();
  },

  serialize() {
    return {
      createNewReactPageViewState: this.createNewReactPageView.serialize()
    };
  },

  getComponentName() {
    const editor = atom.workspace.getActiveTextEditor();
    const fileName = editor.getTitle();
    let componentName = editor.getTitle().replace(/\.js(x)?/, '');
    if (componentName === 'index') {
      const path = editor.getPath();
      const pathSplit = path.split('\\');
      componentName = pathSplit[pathSplit.length - 2];
    }

    return componentName;
  },

  createSimple() {
    const editor = atom.workspace.getActiveTextEditor();
    const componentName = this.getComponentName();

    editor.setText(
`import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {};

const defaultProps = {};

class ${componentName} extends Component {
  render() {
    return (
      <div></div>
    );
  }
}

${componentName}.propTypes = propTypes;
${componentName}.defaultProps = defaultProps;

export default ${componentName};`);

    return true;
  },

  createPure() {
    const editor = atom.workspace.getActiveTextEditor();
    const componentName = this.getComponentName();

    editor.setText(
`import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {};

const defaultProps = {};

function ${componentName}() {
  return (
    <div></div>
  );
}

${componentName}.propTypes = propTypes;
${componentName}.defaultProps = defaultProps;

export default ${componentName};`);
  }
};
