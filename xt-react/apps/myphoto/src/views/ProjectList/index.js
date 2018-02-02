import React from 'react';
import Waypoint from 'react-waypoint';
import {observer} from 'mobx-react';

import './style.scss';
import ProjectLine from '../../components/ProjectLine';
import ToolBar from '../../components/ToolBar';
import EmptyView from '../../components/EmptyView';
import {viewTypes} from '../../constants/string';
import ProjectListStore from '../../stores/ProjectListStore';

@observer
class ProjectList extends React.Component {
  render() {
    const {
      viewMode,
      allImages,
      imageCountInLine,
      togglePreviewModal
    } = this.props;
    const isShow = viewMode === viewTypes.PROJECT;
    const projects = ProjectListStore.projects;
    const ProjectsStyle = `ProjectList${ isShow ? ' show' : '' }`;

    return (
      <div className={ProjectsStyle}>
        {/* <ToolBar /> */}

        <div ref={projectList => ProjectListStore.setContainer(projectList)} style={{minHeight: '85vh'}}>
          {
            projects.map((project, index) => (
              project.images.length ?
                <ProjectLine
                  key={index}
                  project={project}
                  togglePreviewModal={togglePreviewModal}
                  imageCountInLine={imageCountInLine}
                />
                : null
            ))
          }
        </div>

        {
          allImages.length === 0
            ? <EmptyView />
            : null
        }

        {
          viewMode === viewTypes.PROJECT ?
            <Waypoint
              onEnter={() => ProjectListStore.showMoreProjects()}
              scrollableAncestor={window} />
            : null
        }
      </div>
    );
  }
}

export default ProjectList;
