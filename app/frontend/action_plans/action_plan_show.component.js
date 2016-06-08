import { Component }          from 'react';
import { connect }            from 'react-redux';

import { 
  fetchActionPlan,
  deleteActionPlan,
  approveActionPlan,
  changeWeight
} from './action_plans.actions';

import Loading              from '../application/loading.component';
import SocialShareButtons   from '../application/social_share_buttons.component';
import DangerLink           from '../application/danger_link.component';
import FilterMeta           from '../filters/filter_meta.component';

import ActionPlanStatistics from './action_plan_statistics.component';
import ActionPlanProposals  from './action_plan_proposals.component';
import ActionPlanMeetings   from './action_plan_meetings.component';
import ActionPlanReviewer   from './action_plan_reviewer.component';
import WeightControl        from './weight_control.component';

class ActionPlanShow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      editable: false
    }
  }

  componentDidMount() {
    const { session, fetchActionPlan } = this.props;

    this.setState({ editable: session.is_reviewer });

    fetchActionPlan(this.props.actionPlanId).then(() => {
      this.setState({ loading: false });
    });
  }

  render() {
    return (
      <div className="action-plan-show component">
        <Loading show={this.state.loading} />
        {this.renderActionPlan()}
      </div>
    );
  }

  renderActionPlan() {
    const { actionPlan } = this.props;

    if (actionPlan.id) {
      const { 
        id,
        url,
        deleted,
        title, 
        description,
        created_at,
        scope_,
        category,
        subcategory,
        district,
        statistics
      } = actionPlan;

      return (
        <div>
          <div className="row" id={`action_plan_${actionPlan.id}`}>
            <div className="small-12 medium-9 column">
              <i className="icon-angle-left left"></i>&nbsp;

              <a className="left back" href="/action_plans" onClick={() => window.history.back()}>
                {I18n.t('proposals.show.back_link')}
              </a>

              {this.renderReviewerActions()}
              {this.renderNotice()}

              <h2><a href={url}>{title}</a></h2>

              <p className="proposal-info"><span>{ created_at }</span></p>

              <div 
                className="proposal-description"
                dangerouslySetInnerHTML={{ __html: description.autoLink() }} />

              <FilterMeta 
                scope={ scope_ }
                district={ district }
                category={ category }
                subcategory={ subcategory } 
                namespace="action_plans"
                useServerLinks={ true }/>

              <ActionPlanReviewer visible={this.state.editable} />

              <h2>Estat de l'actuacio</h2>
              <p>TODO</p>

              <h2>Alegacions relacionades</h2>
              <p>TODO</p>

              <ActionPlanProposals actionPlan={actionPlan} editable={this.state.editable} />
              <ActionPlanMeetings useServerLinks={true} />
            </div>

            <aside className="small-12 medium-3 column">
              <h3>{ I18n.t("proposals.show.share") }</h3>
              <SocialShareButtons 
                title={ title }
                url={ url }/>
              <div>
                <h3>Autoria</h3>
                <p>Ajuntament de Barcelona, Ecologistes en Accio, Joan BCN, Josefina92</p>
                <hr />
                <h3>Dades</h3>
                <ActionPlanStatistics 
                  statistics={statistics}>
                </ActionPlanStatistics>
                <hr />
                <h3>Seguiment</h3>
              </div>
            </aside>
          </div>
        </div>
      );
    }
    return null;
  }

  renderNotice(){
    if(this.props.actionPlan && this.props.actionPlan.deleted){
      return (
        <div className="alert-box warning">{I18n.t("components.action_plan_show.deleted")}</div>
      )
    }
  }

  renderApproveButton() {
    if(this.props.actionPlan && this.props.actionPlan.approved){
      return (<span className="right">
              {I18n.t("components.action_plan_show.approved")}
              </span>);
    } else {
      return (
          <DangerLink onClick={() => this.props.approveActionPlan(this.props.actionPlan.id)}
        className="approve-proposal button default tiny radius right">
          <i className="icon-edit"></i>
          { I18n.t("components.action_plan_show.approve") }
        </DangerLink>
      )
    }
  }

  renderReviewerActions() {
    const { actionPlan, deleteActionPlan, changeWeight } = this.props;
    const { id, weight, new_revision_url } = actionPlan;

    if (this.state.editable) {
      return (
        <span>
          <DangerLink className="delete-action-plan button danger tiny radius right" onClick={() => deleteActionPlan(id) }>
            <i className="icon-cross"></i>
            { I18n.t("components.action_plan_show.delete") }
          </DangerLink>

          <a href={new_revision_url} className="edit-proposal button success tiny radius right">
            <i className="icon-edit"></i>
            { I18n.t("components.action_plan_show.new_revision") }
          </a>

          { this.renderApproveButton() }

          <span className="right">
            <WeightControl
              weight={ weight }
              onUpdateWeight={ (weight) => changeWeight(id, weight)} />
          </span>
        </span>
      );
    }
  }
}

export default connect(
  ({ session, actionPlan }) => ({ session, actionPlan }),
  {
    fetchActionPlan,
    deleteActionPlan,
    approveActionPlan,
    changeWeight
  }
)(ActionPlanShow);
