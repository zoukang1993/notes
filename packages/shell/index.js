/**
 * bidHall - 寻源服务/询价大厅-维护
 * @date: 2018-12-26
 * @author: CJ <juan.chen01@hand-china.com>
 * @version: 1.0.0
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Form, Tabs, Modal, Collapse, Spin, Icon } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import classnames from 'classnames';
import { isEmpty, filter } from 'lodash';
import uuidv4 from 'uuid/v4';
import querystring from 'querystring';

import { Header, Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import {
  getCurrentOrganizationId,
  getEditTableData,
  getCurrentUserId,
  addItemToPagination,
} from 'utils/utils';
import { DEFAULT_DATETIME_FORMAT, DATETIME_MIN } from 'utils/constants';

import BidInfoForm from './BidInfoForm';
import BidOtherForm from './BidOtherForm';
import QualificationForm from './QualificationForm';
import BidMemberForm from './BidMemberForm';
import ItemLineTable from './ItemLineTable';
import ProfessionalTable from './ProfessionalTable';
import ScoringElementsTable from './ScoringElementsTable';
import SupplierLineTable from './SupplierLineTable';
import ScoringElementModal from './ScoringElementModal';
import TenderNoticeForm from './TenderNoticeForm';

import common from '@/routes/Sbid/common.less';

const { Panel } = Collapse;
const promptCode = 'ssrc.bidHall';

@Form.create({ fieldNameProp: null })
@formatterCollections({ code: ['ssrc.bidHall'] })
@connect(({ bidHall, loading, user }) => ({
  user,
  bidHall,
  releasebidHallLoading: loading.effects['bidHall/releasebidHall'],
  fetchbidHallUpdateLoading: loading.effects['bidHall/fetchBidHeaderDetail'],
  fetchItemLineLoading: loading.effects['bidHall/fetchItemLine'],
  saveItemLineLoading: loading.effects['bidHall/saveItemLine'],
  fetchSupplierLineloading: loading.effects['bidHall/fetchSupplierLine'],
  fetchBidMembersLoading: loading.effects['bidHall/fetchBidMembers'],
  saveBidMembersLoading: loading.effects['bidHall/saveBidMembers'],
  deleteBidMembersLoading: loading.effects['bidHall/deleteBidMembers'],
  saveSupplierLineLoading: loading.effects['bidHall/saveSupplierLine'],
  savebidHallUpdateLoading: loading.effects['bidHall/savebidHallUpdate'],
  deleteSupplierLinesLoading: loading.effects['bidHall/deleteSupplierLines'],
  supplierRecordLoading: loading.effects['bidHall/supplierRecord'],
  saveSupplierRecordLineLoading: loading.effects['bidHall/saveSupplierRecordLine'],
  fetchBulkSupplierDataLoading: loading.effects['bidHall/fetchBulkSupplierData'],
  fetchExpertAllocationDataLoading: loading.effects['bidHall/fetchExpertAllocationData'],
  saveScoringNoneExpertLoading: loading.effects['bidHall/saveScoringNoneExpert'],
  saveAllScoringTemplateLoading: loading.effects['bidHall/saveAllScoringTemplate'],
  deleteScoringNoneExpertLoading: loading.effects['bidHall/deleteScoringNoneExpert'],
  fetchTempelateDetailDataLoading: loading.effects['bidHall/fetchTempelateDetailData'],
  saveScoringNoneTempelateLoading: loading.effects['bidHall/saveScoringNoneTempelate'],
  deleteScoringNoneTempelateLoading: loading.effects['bidHall/deleteScoringNoneTempelate'],
  fetchEvaluateIndicAssignLoading: loading.effects['bidHall/fetchEvaluateIndicAssign'],
  saveEvaluateIndicAssignLoading: loading.effects['bidHall/saveEvaluateIndicAssign'],
  fetchScoringElementLoading: loading.effects['bidHall/fetchScoringElementData'],
  saveScoringElementLoading: loading.effects['bidHall/saveScoringElement'],
  organizationId: getCurrentOrganizationId(),
  userId: getCurrentUserId(),
}))
export default class Update extends Component {
  constructor(props) {
    super(props);
    this.ItemLineTable = {};
    const routerParams = querystring.parse(this.props.history.location.search.substr(1));
    const { expertScoreType = '', preQualificationFlag = 0 } = routerParams;

    this.state = {
      itemLineSelectedRows: [], // 物品明细选中行
      itemLineSelectedRowKeys: [], // 物品明细选中ids
      distributeModalVisible: false, // 物品明细分配供应商
      batchSupplierSelectRows: [], // 批量添加供应商选择rows
      batchSupplierSelectRowKeys: [], // 批量添加供应商选择keys
      batchOperateSupplierModelVisible: false, // 批量添加供应商model
      expertLineSelectedRows: [], // 所选择专家行
      expertLineSelectedRowKeys: [], // 所选专家keys
      scoringElementSelectedRows: [], // 评分要素行
      scoringElementSelectedRowKeys: [], // 评分要素行keys
      bidMemberSelectedRows: [], // 招标小组选中
      bidMemberSelectedRowKeys: [], // 招标小组选中keys
      subjectMatterRule: '', // 标的规则
      sourceMethod: '', // “寻源方式”
      supplierLineSelectedRows: [], // 供应商列表选中行
      supplierLineSelectedRowKeys: [], // 供应商列表选中行keys
      editBidMembersFlag: false, // 招标小组modal
      scoringElementVisible: false, // 招标评分细项modal
      evaluateAssignModalVisible: false, // 评分要素分配专家modal
      scoringSaveType: '', // 评分要素操作的类型-> BUSINESS/TECHNOLOGY/''
      expertSaveType: '', // 保存的类型-> BUSINESS/TECHNOLOGY/''
      bidRuleType: '', // 评标步制
      collapseKeys: ['baseInfos'], // 折叠面板
      localExpertScoreType: expertScoreType, // 页面跳转带过来的专家评分类型
      localPreQualificationFlag: preQualificationFlag * 1, // 页面跳转带过来的资格预审标识
    };
  }

  componentDidMount() {
    this.fetchbidHallUpdate();
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'bidHall/updateState',
      payload: {
        header: {},
        bidMembersList: [],
        itemLine: [],
        itemLinePagination: {},
        supplierLine: [],
        scoringElement: [], // 评分要素数据
        scoringNoneTempelate: [], // 模板明细不区分数据
        scoringBusinessTempelate: [], // 模板明细商务组数据
        scoringTechnologyTempelate: [], // 模板明细技术组数据
        scoringNoneExpert: [], // 专家分配不区分数据
        scoringBusinessExpert: [], // 专家分配商务组数据
        scoringTechnologyExpert: [], // 专家分配技术组数据
        itemLineChange: false,
        itemLineExpandedKeys: [],
      },
    });
  }

  /**
   * 查询维护页面信息
   */
  @Bind()
  fetchbidHallUpdate() {
    const {
      match: { params, path },
      dispatch,
      organizationId,
    } = this.props;
    dispatch({
      type: 'bidHall/fetchBidHeaderDetail',
      payload: { organizationId, bidHeaderId: params.bidId, path },
    }).then((res = {}) => {
      const { expertScoreType = '', sourceMethod } = res;
      if (expertScoreType && expertScoreType === 'ONLINE') {
        this.fetchExpert();
        this.fetchScoring();
      }
      this.setState({
        sourceMethod,
      });
    });
    this.fetchSupplier();
    this.fetchItemLine();

    const lovCodes = {
      quotationTypes: 'SSRC.QUOTATION_TYPE', // 报价方式
      sourceMethods: 'SSRC.SOURCE_METHOD', // 寻源方式
      subjectMatterRules: 'SSRC.SUBJECT_MATTER_RULE', // 标的规则
      reviewMethods: 'SSRC.REVIEW_METHOD', // 审查方式
      bidRoles: 'SSRC.BID_MEMBER_ROLE', // 招标角色
      sourceStages: 'SSRC.SOURCE_STAGE', // 招标阶段
      indicateTypes: 'SSRC.INDICATE_TYPE', // 要素类型
    };
    dispatch({
      type: 'bidHall/batchCode',
      payload: { lovCodes },
    });
  }

  /**
   * 获取供应商
   *
   * @memberof Update
   */
  fetchSupplier() {
    const {
      match: { params },
      dispatch,
      organizationId,
    } = this.props;
    dispatch({
      type: 'bidHall/fetchSupplierLine',
      payload: { organizationId, bidHeaderId: params.bidId },
    });
  }

  /**
   * 获取专家数据
   *
   * @memberof Update
   */
  fetchExpert() {
    const {
      match: { params },
      dispatch,
      organizationId,
    } = this.props;
    dispatch({
      type: 'bidHall/fetchExpertAllocationData',
      payload: {
        organizationId,
        sourceHeaderId: params.bidId,
        sourceFrom: 'BID', // 来源是bid/rfx
        expertStatus: 'SUBMITTED', // 查询提交后的专家数据
      },
    });
  }

  /**
   * 获取招标小组
   *
   * @memberof Update
   */
  fetchMembers() {
    const {
      dispatch,
      organizationId,
      match: { params = {}, path },
    } = this.props;

    dispatch({
      type: 'bidHall/fetchBidMembers',
      payload: { organizationId, bidHeaderId: params.bidId, path },
    });
  }

  /**
   * 获取评分要素数据
   *
   * @memberof Update
   */
  fetchScoring() {
    const {
      match: { params },
      dispatch,
      organizationId,
    } = this.props;
    dispatch({
      type: 'bidHall/fetchTempelateDetailData',
      payload: {
        organizationId,
        sourceHeaderId: params.bidId,
        sourceFrom: 'BID',
        indicStatus: 'SUBMITTED', // 查询提交后的评分要素数据
      },
    });
  }

  /**
   * 物品明细 - 查询
   */
  @Bind()
  fetchItemLine(page = {}) {
    const {
      match: { params },
      dispatch,
      organizationId,
    } = this.props;
    dispatch({
      type: 'bidHall/fetchItemLine',
      payload: {
        page,
        organizationId,
        bidHeaderId: params.bidId,
      },
    }).then(res => {
      this.initItemLineExpandKeys(res);
    });
  }

  /**
   * 物品明细 - 页面初始化展开
   *
   * @param {*} res
   * @param {*} [result=[]]
   * @memberof Update
   */
  initItemLineExpandKeys(res, result = []) {
    const { dispatch } = this.props;

    const keys = this.updateItemLineExpandedKeys(res, result);
    dispatch({
      type: 'bidHall/updateState',
      payload: {
        itemLineExpandedKeys: keys,
      },
    });
  }

  /**
   * 物品明细 - 更新展开数据的行keys
   *
   * @param {*} [res=[]]
   * @param {*} [keys=[]]
   * @returns keys
   * @memberof Update
   */
  updateItemLineExpandedKeys(res = [], keys = []) {
    if (!res) {
      return;
    }

    if (res instanceof Array) {
      res.forEach(item => {
        keys.push(item.bidLineItemId);
        this.updateItemLineExpandedKeys(item.children, keys);
      });
    } else if (res instanceof Object) {
      if (!res.bidLineItemId) {
        return;
      }
      keys.push(res.bidLineItemId);
      this.updateItemLineExpandedKeys(res.children, keys);
    } else {
      return [];
    }

    return [...new Set(keys)];
  }

  /**
   * 物品明细 - 点击+操作展开关闭状态
   *
   * @param {*} expanded
   * @param {*} record
   * @memberof Update
   */
  @Bind()
  handleExpandRow(expanded, record) {
    const {
      bidHall: { itemLineExpandedKeys = [] },
    } = this.props;

    if (!expanded) {
      this.unExpandedRow(record, itemLineExpandedKeys);
    } else {
      this.initItemLineExpandKeys(record, itemLineExpandedKeys);
    }
  }

  /**
   * 物品明细 - 页面初始化关闭
   *
   * @param {*} record
   * @param {*} itemLineExpandedKeys
   * @returns
   * @memberof Update
   */
  unExpandedRow(record, itemLineExpandedKeys) {
    if (!record.bidLineItemId) {
      return;
    }

    const { dispatch } = this.props;

    const updateKeys = key => {
      dispatch({
        type: 'bidHall/updateState',
        payload: {
          itemLineExpandedKeys: key,
        },
      });
    };

    const oldKeys = [...[], ...itemLineExpandedKeys];

    oldKeys.splice(oldKeys.indexOf(record.bidLineItemId), 1);
    if (!record.chidlren || !Array.isArray(record.children) || !record.chidlren.length) {
      updateKeys(oldKeys);
      return;
    }

    record.children.forEach(child => {
      oldKeys.splice(oldKeys.indexOf(child.bidLineItemId), 1);
    });

    dispatch({
      type: 'bidHall/updateState',
      payload: {
        itemLineExpandedKeys: oldKeys,
      },
    });
  }

  /**
   * onCollapseChange - 折叠面板onChange
   * @param {Array<string>} collapseKeys - Panels key
   */
  @Bind()
  onCollapseChange(collapseKeys) {
    this.setState({
      collapseKeys,
    });
  }

  /**
   * 改变币种-人民币时汇率为1.0000000
   */
  @Bind()
  changeCurrencyCode(val) {
    const { form } = this.props;
    if (val === 'CNY') {
      form.setFieldsValue({ exchangeRate: 1.0 });
    } else {
      form.setFieldsValue({ exchangeRate: undefined });
    }
  }

  /**
   * 编辑招标小组
   *
   * @memberof Update
   */
  @Bind()
  editBidMembers() {
    this.fetchMembers();

    this.setState({
      bidMemberSelectedRows: [],
      bidMemberSelectedRowKeys: [],
      editBidMembersFlag: true,
    });
  }

  /**
   * 取消操作小组成员
   */
  @Bind()
  handleMembersCancel() {
    this.props.dispatch({
      type: 'bidHall/updateState',
      payload: {
        scoringElement: [],
      },
    });

    this.setState({
      editBidMembersFlag: false,
      bidMemberSelectedRows: [],
      bidMemberSelectedRowKeys: [],
    });
  }

  /**
   * 招标小组 -新增行
   */
  @Bind()
  handleMembersCreate() {
    const {
      dispatch,
      organizationId,
      match: { params },
      bidHall: { bidMembersList = [] },
    } = this.props;
    dispatch({
      type: 'bidHall/updateState',
      payload: {
        bidMembersList: [
          {
            bidHeaderId: params.bidId,
            bidMemberId: uuidv4(),
            tenantId: organizationId,
            bidRole: undefined,
            loginName: undefined,
            userName: undefined,
            sectionName: undefined,
            contactMail: undefined,
            contactMobilephone: undefined,
            objectVersionNumber: 0,
            _status: 'create',
          },
          ...bidMembersList,
        ],
      },
    });
  }

  /**
   * 添加保存小组成员
   *
   * @memberof Update
   */
  @Bind()
  handleMembersSave() {
    const {
      dispatch,
      organizationId,
      match: { params = {}, path },
      bidHall: { bidMembersList = [] },
    } = this.props;

    const newParams = getEditTableData(bidMembersList, ['bidMemberId']);

    if (!isEmpty(newParams)) {
      dispatch({
        type: 'bidHall/saveBidMembers',
        payload: { newParams, organizationId, bidHeaderId: params.bidId },
      }).then(res => {
        if (res) {
          notification.success();
          this.fetchMembers();
          dispatch({
            type: 'bidHall/fetchBidHeaderDetail',
            payload: { organizationId, bidHeaderId: params.bidId, path },
          });
        }
      });
    }
  }

  // 删除小组成员
  @Bind()
  handleMembersDelete = () => {
    const {
      dispatch,
      organizationId,
      match: { params = {} },
      bidHall: { bidMembersList = [] },
    } = this.props;
    const { bidMemberSelectedRows } = this.state;
    const newMembers = filter(bidMembersList, item => {
      return (
        bidMemberSelectedRows &&
        bidMemberSelectedRows.map(r => r.bidMemberId).indexOf(item.bidMemberId) < 0
      );
    });

    Modal.confirm({
      title: intl.get('hzero.common.message.confirm.remove').d('确定删除选中数据?'),
      onOk: () => {
        const remoteDelete = [];
        bidMemberSelectedRows.forEach(item => {
          if (item._status === 'update') {
            remoteDelete.push(item);
          }
        });

        if (isEmpty(remoteDelete)) {
          dispatch({
            type: 'bidHall/updateState',
            payload: {
              bidMembersList: newMembers,
            },
          });
        } else {
          dispatch({
            type: 'bidHall/deleteBidMembers',
            payload: { newParams: remoteDelete, organizationId, bidHeaderId: params.bidId },
          }).then(res => {
            if (res) {
              notification.success();
              this.fetchMembers();
              this.setState({ bidMemberSelectedRows: [], bidMemberSelectedRowKeys: [] });
            }
          });
        }
      },
      onCancel: () => {
        this.handleMembersCancel();
      },
    });
  };

  // 改变标的规则
  @Bind()
  changeSubjectMatterRule = val => {
    const {
      organizationId,
      form,
      dispatch,
      bidHall: { header = {} },
    } = this.props;
    const { subjectMatterRule } = this.state;

    if (!val || subjectMatterRule === val) {
      return;
    }

    Modal.confirm({
      title: intl
        .get(`${promptCode}.message.confirm.remove`)
        .d('切换标的规则后，将会清空物品信息，是否继续切换?'),
      onOk: () => {
        dispatch({
          type: 'bidHall/changeSubjectMatterRule',
          payload: {
            organizationId,
            bidHeaderId: header.bidHeaderId,
            subjectMatterRule: val,
          },
        }).then(res => {
          if (!res) {
            return;
          }
          this.setState({
            subjectMatterRule: val,
          });
          this.fetchbidHallUpdate();
        });
      },
      onCancel: () => {
        form.setFieldsValue({
          subjectMatterRule: header.subjectMatterRule,
        });
        this.setState({
          subjectMatterRule: header.subjectMatterRule,
        });

        dispatch({
          type: 'bidHall/updteState',
          payload: {
            header,
          },
        });
      },
    });
  };

  // 改变寻缘方式 lov
  @Bind()
  changeSourceMethod = val => {
    const { form } = this.props;

    form.setFieldsValue({
      projectName: '',
      projectId: '',
      projectNum: '',
      bidPlanLineName: '',
      bidPlanId: '',
    });

    let values = '';
    switch (val) {
      case 'OPEN':
        values = 'PARTNER_DISCLOSURE';
        break;
      case 'ALL_OPEN':
        values = 'FULL_PLATFORM_OPEN';
        break;
      default:
        values = val;
        break;
    }

    this.setState({
      sourceMethod: values,
    });
  };

  /**
   * 改变寻源模板
   *
   * @param {*} val
   * @param {*} record
   * @returns
   * @memberof Update
   */
  @Bind()
  changeTemplateId(val, record) {
    if (!val) {
      return;
    }

    const { bidRuleType = '' } = record;
    const title = intl
      .get(`${promptCode}.view.message.modal.confirmChangeSourceTemplate`)
      .d('确认改变寻源模板');
    const inContent = `${intl
      .get('hzero.common.message.confirm')
      .d('由于寻源模板改变，继续操作将清空已维护的招标信息，是否确认切换寻源模板')} ?`;
    Modal.confirm({
      title,
      content: <div>{inContent}</div>,
      onOk: this.sureChangeTemplate(val, bidRuleType),
      onCancel: this.cancelChangeTemplate,
    });
  }

  /**
   * modal 确认改变寻源模板
   *
   * @param {*} templateId
   * @param {*} bidRuleType
   * @memberof Update
   */
  @Bind()
  sureChangeTemplate(templateId, bidRuleType) {
    this.changeBidTemplateOrCompany({
      templateId,
    });

    this.setState({ bidRuleType });
    this.fetchbidHallUpdate();
  }

  /**
   * modal 取消改变寻源模板
   *
   * @memberof Update
   */
  @Bind()
  cancelChangeTemplate() {
    const {
      form,
      bidHall: { header = {} },
    } = this.props;

    form.setFieldsValue({
      templateId: header.templateId,
      templateName: header.templateName,
    });
  }

  /**
   * 请求招标改变 寻源模板/公司
   *
   * @param {*} [data={}]
   * @param {string} [type='']
   * @memberof Update
   */
  changeBidTemplateOrCompany(data = {}) {
    const {
      dispatch,
      organizationId,
      match: { params = {} },
    } = this.props;

    dispatch({
      type: 'bidHall/changeBidTemplateOrCompany',
      payload: {
        organizationId,
        sourceHeaderId: params.bidId,
        ...data,
      },
    });
    // notification.success();
  }

  /**
   * 改变公司 lov
   *
   * @param {*} val
   * @param {*} record
   * @param {*} tt
   * @memberof Update
   */
  @Bind()
  changeCompany(val, record) {
    if (!val) {
      return;
    }

    const { sourceMethod } = this.state;
    if (sourceMethod !== 'INVITE') {
      this.sureChangeCompany(record);
      this.fetchSupplier();
      return;
    }

    const title = intl
      .get(`${promptCode}.view.message.modal.confirmChangeCompany`)
      .d('确认切换公司');
    const inContent = `${intl
      .get('hzero.common.message.AfterSwitchingCompanyInvitedVendorsEmptiedWhetherToContinue')
      .d(`切换公司后，邀请的供应商会清空，是否继续`)} ?`;
    Modal.confirm({
      title,
      content: <div>{inContent}</div>,
      onOk: this.sureChangeCompany(record),
      onCancel: this.cancelChangeCompany,
    });
  }

  /**
   * 确认切换公司
   *
   * @param {*} [record={}]
   * @memberof Update
   */
  @Bind()
  sureChangeCompany(record = {}) {
    const { companyId } = record;
    this.changeBidTemplateOrCompany({
      companyId,
    });
  }

  /**
   * 取消改变公司
   *
   * @memberof Update
   */
  @Bind()
  cancelChangeCompany() {
    const {
      form,
      bidHall: { header = {} },
    } = this.props;

    form.setFieldsValue({
      companyId: header.companyId,
      companyName: header.companyName,
    });
  }

  /**
   * 当币种为人民币，汇率为1
   *
   * @param {*} val
   * @param {*} record
   * @memberof Update
   */
  @Bind()
  setValue(val, record) {
    const { form } = this.props;
    this.setState({
      currencyId: record.currencyId,
    });

    if (val === 'CNY') {
      form.setFieldsValue({
        exchangeRate: 1.0,
      });
    } else {
      form.setFieldsValue({
        exchangeRate: null,
      });
    }
  }

  /**
   * 选择寻源计划
   *
   * @param {*} val  当前值
   * @param {*} record 当前记录数据
   * @returns
   * @memberof Update
   */
  @Bind()
  changeBidSourcePlan(val, record) {
    const { form } = this.props;

    const {
      projectName = '',
      projectId = '',
      projectNum = '',
      projectAddress = '',
      bidPlanLineName = '',
      bidPlanId = '',
    } = record;

    form.setFieldsValue({
      projectName,
      projectId,
      projectNum,
      bidLocation: projectAddress,
      bidPlanLineName,
      bidPlanId,
    });
  }

  /**
   * 改变项目编码
   *
   * @param {*} val
   * @param {*} record
   * @returns
   * @memberof Update
   */
  @Bind()
  changeProjectInfo(val, record) {
    const { form } = this.props;

    form.setFieldsValue({
      projectName: val ? record.projectName : '',
      projectId: val ? record.projectId : '',
      projectNum: val ? record.projectNum : '',
      bidLocation: val ? record.projectAddress : '',
    });
  }

  /**
   * 选中付款方式数据
   *
   * @param {*} val -- lov 值
   * @param {*} record
   * @returns
   * @memberof Update
   */
  @Bind()
  changePaymentType(val, record) {
    const { form } = this.props;
    if (!val) {
      return;
    }

    const { typeId: paymentTypeId, typeName: paymentTypeName } = record;

    form.setFieldsValue({
      paymentTypeId,
      paymentTypeName,
    });
  }

  /**
   * 改变审查方式
   * 选择合格制时，合格上限清空置灰
   */
  @Bind()
  changeReviewMethod(value) {
    const {
      form: { setFieldsValue },
    } = this.props;
    if (value === 'QUALIFIED') {
      setFieldsValue({ qualifiedLimit: undefined });
    }
  }

  /**
   * 启用评分细项
   *
   * @param {*} val
   * @memberof Update
   */
  @Bind()
  changeScoreFlag(val) {
    const { form } = this.props;

    form.setFieldsValue({
      enableScoreFlag: val.target.checked,
    });
  }

  /**
   * 编辑-打开评分要素定义模态框
   */
  @Bind()
  showScoringElement() {
    this.setState({
      scoringElementVisible: true,
    });
    this.fetchScoringElementData();
  }

  /**
   * 查询-评分要素定义数据
   */
  @Bind()
  fetchScoringElementData() {
    const {
      dispatch,
      bidHall: { header = {} },
      organizationId,
    } = this.props;
    dispatch({
      type: 'bidHall/fetchScoringElementData',
      payload: { prequalHeaderId: header.prequalHeaderId, organizationId },
    });
  }

  /**
   * 获取选中行-评分要素定义
   */
  @Bind()
  handleScoringElementRowSelectChange(keys = [], selectedRows = []) {
    this.setState({
      scoringElementSelectedRowKeys: keys,
      scoringElementSelectedRows: selectedRows,
    });
  }

  /**
   * 新增行-评分要素定义
   */
  @Bind()
  handleCreateScoringElement() {
    const {
      dispatch,
      bidHall: { scoringElement = [], header = {} },
    } = this.props;
    dispatch({
      type: 'bidHall/updateState',
      payload: {
        scoringElement: [
          {
            prequalHeaderId: header.prequalHeaderId,
            prequalScoreAssignId: uuidv4(),
            indicateId: undefined,
            indicateName: undefined,
            indicateType: undefined,
            minScore: undefined,
            maxScore: undefined,
            mustApprovedFlag: 0,
            qualifiedScore: undefined,
            _status: 'create',
          },
          ...scoringElement,
        ],
      },
    });
  }

  /**
   * 删除-评分要素定义
   */
  @Bind
  handleDeleteScoringElement() {
    const {
      dispatch,
      bidHall: { scoringElement = [] },
      organizationId,
    } = this.props;
    const { scoringElementSelectedRows } = this.state;
    // 过滤出勾选数据的剩下数据
    const newScoringElement = filter(scoringElement, item => {
      return (
        scoringElementSelectedRows &&
        scoringElementSelectedRows
          .map(r => r.prequalScoreAssignId)
          .indexOf(item.prequalScoreAssignId) < 0
      );
    });
    Modal.confirm({
      title: intl.get('hzero.common.message.confirm.remove').d('确定删除选中数据?'),
      onOk: () => {
        const remoteDelete = [];
        scoringElementSelectedRows.forEach(item => {
          if (item._status === 'update') {
            remoteDelete.push(item);
          }
        });
        if (isEmpty(remoteDelete)) {
          dispatch({
            type: 'bidHall/updateState',
            payload: {
              scoringElement: newScoringElement,
            },
          });
          this.setState({ scoringElementSelectedRows: [], scoringElementSelectedRowKeys: [] });
        } else {
          dispatch({
            type: 'bidHall/deleteScoringElement',
            payload: { remoteDelete, organizationId },
          }).then(res => {
            if (res) {
              notification.success();
              dispatch({
                type: 'bidHall/updateState',
                payload: {
                  scoringElement: newScoringElement,
                },
              });
              this.setState({ scoringElementSelectedRows: [], scoringElementSelectedRowKeys: [] });
            }
          });
        }
      },
    });
  }

  /**
   * 保存-评分要素定义
   */
  @Bind()
  handleSaveScoringElement() {
    const {
      dispatch,
      organizationId,
      bidHall: { scoringElement = [], header = {} },
    } = this.props;
    const { scoringElementSelectedRows = [] } = this.state;
    const params = getEditTableData(scoringElement, ['prequalScoreAssignId']);
    if (!isEmpty(params)) {
      const newParams = params.map(item => {
        return {
          ...item,
          prequalHeaderId: item.prequalHeaderId,
          prequalScoreAssignId: item.prequalScoreAssignId,
          scoreIndicId: item.indicateId,
          mustApprovedFlag: item.mustApprovedFlag,
          qualifiedScore: item.qualifiedScore,
          objectVersionNumber: item.objectVersionNumber,
        };
      });
      dispatch({
        type: 'bidHall/saveScoringElement',
        payload: { newParams, organizationId, prequalHeaderId: header.prequalHeaderId },
      }).then(res => {
        if (res) {
          notification.success();
          this.fetchScoringElementData();
          if (!isEmpty(scoringElementSelectedRows)) {
            this.setState({
              scoringElementSelectedRows: [],
              scoringElementSelectedRowKeys: [],
            });
          }
        }
      });
    }
  }

  /**
   * 关闭-评分要素定义模态框
   */
  @Bind()
  handleCancelScoringElement() {
    this.props.dispatch({
      type: 'bidHall/updateState',
      payload: {
        scoringElement: [],
      },
    });
    this.setState({
      scoringElementVisible: false,
      scoringElementSelectedRows: [],
      scoringElementSelectedRowKeys: [],
    });
  }

  /**
   * 选择参考模板回调-评分要素
   */
  @Bind()
  handleSelectTemplateOk(value) {
    const {
      dispatch,
      bidHall: { header = {} },
      organizationId,
    } = this.props;
    const { scoringElementSelectedRows = [] } = this.state;
    if (value.scoreIndics) {
      dispatch({
        type: 'bidHall/saveScoringElement',
        payload: {
          newParams: value.scoreIndics,
          organizationId,
          prequalHeaderId: header.prequalHeaderId,
        },
      }).then(res => {
        if (res) {
          notification.success();
          if (!isEmpty(scoringElementSelectedRows)) {
            this.setState({
              scoringElementSelectedRows: [],
              scoringElementSelectedRowKeys: [],
            });
          }
          this.fetchScoringElementData();
        }
      });
    } else {
      Modal.confirm({
        title: intl
          .get(`${promptCode}.view.message.confirm。notDefineScoringElement`)
          .d('该模板未定义评分要素'),
        onOk: () => {},
        onCancel: () => {},
      });
    }
  }

  /**
   * 物品明细-新增行
   */
  @Bind()
  createItemLine() {
    const {
      dispatch,
      organizationId,
      match: { params },
      bidHall: { itemLine = [], itemLinePagination = {}, header = {} },
    } = this.props;
    const { subjectMatterRule } = header;

    dispatch({
      type: 'bidHall/updateState',
      payload: {
        itemLine: [
          {
            sectionFlag: 1,
            bidHeaderId: params.bidId,
            bidLineItemId: uuidv4(),
            tenantId: organizationId,
            bidLineItemNum: itemLine.length + 1,
            // children: subjectMatterRule === 'NONE' ? null : [{
            //   bidHeaderId: '',
            //   parentSectionId: '',
            //   parentSectionNum: '',
            //   businessUnit: '',
            //   bidLineItemId: '',
            //   bidLineItemNum: '',
            // }],
            children: subjectMatterRule === 'NONE' ? null : [],
            sectionNum: undefined,
            sectionName: undefined,
            demandDate: null,
            ouId: undefined,
            inventoryOrg: organizationId,
            itemCode: undefined,
            itemName: undefined,
            itemCategory: undefined,
            itemCategoryId: null,
            itemCategoryName: '',
            bidQuantity: undefined,
            unit: undefined,
            costPrice: undefined,
            taxIncludedFlag: undefined,
            taxRate: undefined,
            prNum: undefined,
            lineNum: undefined,
            parentSectionId: null,
            parentSectionNum: null,
            roundFlag: '',
            currentRoundNumber: '',
            freightIncludedFlag: 0,
            _status: 'create',
          },
          ...itemLine,
        ],
        itemLinePagination: addItemToPagination(itemLine.length, itemLinePagination),
      },
    });
  }

  /**
   * 物品明细-新增物品行
   */
  @Bind()
  createItemLineSon(val) {
    const {
      dispatch,
      match: { params },
      bidHall: { itemLine = [], itemLineExpandedKeys },
    } = this.props;

    const itemLineSon = itemLine.map((item, index) => {
      if (item.bidLineItemId === val.bidLineItemId) {
        const childrenArr = item.children ? item.children : [];
        const createdLine = this.handleCreateChildren(params, val, item, childrenArr);
        itemLine[index].children = createdLine;
      }
      return item;
    });

    // 打开物品行
    this.initItemLineExpandKeys(val, itemLineExpandedKeys);

    dispatch({
      type: 'bidHall/updateState',
      payload: {
        itemLine: [...itemLineSon],
      },
    });
  }

  /**
   * 物品明细-点击分配按钮
   */
  @Bind()
  onDistributeSupplierForItemLine(record) {
    const { sourceMethod } = this.state;
    if (!record || sourceMethod !== 'INVITE') {
      return;
    }

    const {
      dispatch,
      organizationId,
      bidHall: { supplierLine = [] },
    } = this.props;

    if (!supplierLine.length) {
      notification.warning({
        message: intl.get(`${promptCode}.modal.bidHall.noSupplier`).d('没有供应商!'),
      });
      return;
    }

    dispatch({
      type: 'bidHall/supplierRecord',
      payload: {
        organizationId,
        bidHeaderId: record.bidHeaderId,
        bidLineItemId: record.bidLineItemId,
      },
    });

    this.setState({ distributeModalVisible: true });
  }

  /**
   * 物品明细-分配招标明细
   */
  @Bind()
  distributeSupplierForItemLIne() {
    const {
      dispatch,
      organizationId,
      bidHall: { supplierData = [] },
    } = this.props;
    const newSupplierData = getEditTableData(supplierData, ['itemSupAssignId']);

    dispatch({
      type: 'bidHall/saveSupplierRecordLine',
      payload: {
        organizationId,
        other: newSupplierData,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.cancelDistribute();
      }
    });
  }

  /**
   * 明细取消分配供应商,
   * void
   * @memberof Update
   */
  @Bind()
  cancelDistribute() {
    this.setState({ distributeModalVisible: false });

    const { dispatch } = this.props;

    dispatch({
      type: 'bidHall/updateState',
      payload: {
        supplierData: [],
      },
    });
  }

  /**
   * 创建明细子元素
   *
   * @param {*} [children=[]] 子元素数组对象关闭modal
   * @param {*} params
   * @param {*} val 父元素数据
   * @returns
   * @memberof new children object
   */
  handleCreateChildren(params, val, item, childrenArr = []) {
    const childLen = item.children ? item.children.length + 1 : 1;
    const newChildren = [
      ...childrenArr,
      {
        bidHeaderId: params.bidId,
        parentSectionId: val.bidLineItemId,
        parentSectionNum: val.bidLineItemNum,
        bidLineItemId: uuidv4(),
        tenantId: val.tenantId,
        bidLineItemNum: childLen,
        sectionFlag: 0,
        roundFlag: '',
        currentRoundNumber: '',
        freightIncludedFlag: 0,
        _status: 'create',
      },
    ];

    return newChildren;
  }

  /**
   * 物品明细-保存
   */
  @Bind()
  saveItemLine() {
    const {
      dispatch,
      organizationId,
      match: { params },
      bidHall: { itemLine = [], itemLinePagination = {} },
    } = this.props;

    const newParams = this.getItemLineSaveDate(itemLine);
    if (!isEmpty(newParams)) {
      const newParameters = newParams.map(item => {
        return {
          ...item,
          demandDate: item.demandDate ? item.demandDate.format(DATETIME_MIN) : undefined,
        };
      });
      dispatch({
        type: 'bidHall/saveItemLine',
        payload: { newParameters, organizationId, bidHeaderId: params.bidId },
      }).then(res => {
        if (res) {
          notification.success();
          this.fetchItemLine(itemLinePagination);
          if (!isEmpty(this.state.itemLineSelectedRowKeys)) {
            this.setState({
              itemLineSelectedRows: [],
              itemLineSelectedRowKeys: [],
            });
          }
        }
      });
    }
  }

  /**
   * 物品明细-本地删除-筛选不需要删除的数据
   *
   * @returns 本地未删除的数据
   * @memberof Update
   */
  filterBeforeDeleteLineItems() {
    const {
      bidHall: { itemLine = [] },
    } = this.props;

    const { itemLineSelectedRowKeys } = this.state;
    const unDeleteData = [];

    itemLine.forEach(item => {
      if (item && !itemLineSelectedRowKeys.includes(item.bidLineItemId)) {
        if (item.children && item.children.length) {
          /* eslint-disable no-param-reassign */
          item.children = item.children.filter(
            child => child && !itemLineSelectedRowKeys.includes(child.bidLineItemId)
          );
        } else {
          item.children = [];
        }
        unDeleteData.push(item);
      }
      return unDeleteData;
    });

    return unDeleteData;
  }

  /**
   * 物品明细 - 批量删除
   */
  @Bind()
  deleteItemLines() {
    const {
      dispatch,
      match: { params = {}, path },
      organizationId,
    } = this.props;

    const { itemLineSelectedRows } = this.state;
    const unDeleteData = this.filterBeforeDeleteLineItems();

    Modal.confirm({
      title: intl.get('hzero.common.message.confirm.remove').d('确定删除选中数据?'),
      onOk: () => {
        const remoteDelete = [];
        itemLineSelectedRows.forEach(item => {
          if (item._status === 'update') {
            remoteDelete.push(item);
          }
        });

        if (isEmpty(remoteDelete)) {
          dispatch({
            type: 'bidHall/updateState',
            payload: {
              itemLine: unDeleteData,
            },
          });
          this.setState({ itemLineSelectedRowKeys: [], itemLineSelectedRows: [] });
        } else {
          dispatch({
            type: 'bidHall/deleteItemLines',
            payload: { remoteDelete, organizationId },
          }).then(res => {
            if (res) {
              notification.success();
              dispatch({
                type: 'bidHall/fetchItemLine',
                payload: { organizationId, bidHeaderId: params.bidId, path },
              });
              this.setState({ itemLineSelectedRowKeys: [], itemLineSelectedRows: [] });
            }
          });
        }
      },
    });
  }

  /**
   * 物品明细-表格内容改变
   */
  @Bind()
  changeItemLineTableData() {
    const {
      dispatch,
      bidHall: { itemLineChange = false },
    } = this.props;
    if (!itemLineChange) {
      dispatch({
        type: 'bidHall/updateState',
        payload: {
          itemLineChange: true,
        },
      });
    }
  }

  /**
   * 供应商列表-新增行
   */
  @Bind()
  createSupplierLine() {
    const {
      dispatch,
      organizationId,
      match: { params },
      bidHall: { supplierLine = [], supplierLinePagination = {} },
    } = this.props;
    dispatch({
      type: 'bidHall/updateState',
      payload: {
        supplierLine: [
          {
            bidHeaderId: params.bidId,
            bidLineSupplierId: uuidv4(),
            tenantId: organizationId,
            supplierCompanyNum: undefined,
            supplierCompanyName: undefined,
            lifeCycle: undefined,
            contactName: undefined,
            contactMobilephone: undefined,
            contactMail: '',
            supplierContactId: undefined,
            _status: 'create',
          },
          ...supplierLine,
        ],
        supplierLinePagination: addItemToPagination(supplierLine.length, supplierLinePagination),
      },
    });
  }

  /**
   * 打开批量添加供应商弹窗
   *
   * @memberof Update
   */
  @Bind()
  openBatchAddModel() {
    this.setState({
      batchOperateSupplierModelVisible: true,
    });

    this.fetchSupplierList();
  }

  /**
   * 获取供应商列表数据
   *
   * @memberof Update
   */
  @Bind()
  fetchSupplierList(page = {}) {
    const {
      dispatch,
      organizationId,
      userId,
      bidHall: { header = {} },
      form: { getFieldValue },
    } = this.props;
    const categoryId = getFieldValue('categoryId') || '';

    dispatch({
      type: 'bidHall/fetchBulkSupplierData',
      payload: {
        organizationId,
        userId,
        categoryId,
        companyId: header.companyId || '',
        lovCode: 'SSRC.SUPPLIER',
        page,
      },
    });
    this.setState({
      batchSupplierSelectRows: [],
      batchSupplierSelectRowKeys: [],
    });
  }

  /**
   * 批量添加供应商
   *
   * @memberof Update
   */
  @Bind()
  batchAddBidSupplier() {
    const {
      dispatch,
      organizationId,
      match: { params },
    } = this.props;

    const { batchSupplierSelectRows } = this.state;

    if (!isEmpty(batchSupplierSelectRows)) {
      dispatch({
        type: 'bidHall/saveSupplierLine',
        payload: { newParams: batchSupplierSelectRows, organizationId, bidHeaderId: params.bidId },
      }).then(res => {
        if (res) {
          notification.success();
          this.fetchSupplier();
          this.cancelBatchOperate();
        }
      });
    }
    this.cancelBatchOperate();
  }

  /**
   * 取消供应商批量操作
   *
   * @memberof Update
   */
  @Bind()
  cancelBatchOperate() {
    this.setState({
      batchOperateSupplierModelVisible: false,
      batchSupplierSelectRows: [],
      batchSupplierSelectRowKeys: [],
    });
  }

  /**
   * 供应商列表-保存
   */
  @Bind()
  saveSupplierLine() {
    const {
      dispatch,
      organizationId,
      match: { params },
      bidHall: { supplierLine = [] },
    } = this.props;

    const newParams = getEditTableData(supplierLine, ['bidLineSupplierId']);
    const { supplierLineSelectedRows = [] } = this.state;

    if (!isEmpty(newParams)) {
      dispatch({
        type: 'bidHall/saveSupplierLine',
        payload: { newParams, organizationId, bidHeaderId: params.bidId },
      }).then(res => {
        if (res) {
          notification.success();
          this.fetchSupplier();
          this.setState({ editBidMembersFlag: false });
          if (!isEmpty(supplierLineSelectedRows)) {
            this.onSupplierLineRowChange([], []);
          }
        }
      });
    }
  }

  /**
   * 获取供应商列表数据
   *
   * @memberof Update
   */
  @Bind()
  deleteSupplierLine() {
    const {
      dispatch,
      organizationId,
      match: { params },
      bidHall: { supplierLine = [] },
    } = this.props;

    const { supplierLineSelectedRows = [] } = this.state;
    const needRemoteDeleteSupplier =
      supplierLineSelectedRows &&
      supplierLineSelectedRows.filter(item => item._status === 'update');
    const remoteDelete = getEditTableData(needRemoteDeleteSupplier, ['bidLineSupplierId']);
    const localeDelete =
      supplierLineSelectedRows &&
      supplierLineSelectedRows.filter(item => item._status === 'create');
    const sourceData = filter(supplierLine, item => {
      return (
        supplierLineSelectedRows &&
        supplierLineSelectedRows.map(r => r.bidLineSupplierId).indexOf(item.bidLineSupplierId) < 0
      );
    });

    if (!isEmpty(localeDelete)) {
      dispatch({
        type: 'bidHall/updateState',
        payload: {
          supplierLine: sourceData,
        },
      });
      this.setState({
        supplierLineSelectedRows: [],
        supplierLineSelectedRowKeys: [],
      });
    }

    if (!isEmpty(remoteDelete)) {
      dispatch({
        type: 'bidHall/deleteSupplierLines',
        payload: { remoteDelete, organizationId, bidHeaderId: params.bidId },
      }).then(res => {
        if (res) {
          dispatch({
            type: 'bidHall/updateState',
            payload: {
              supplierLineChange: false,
            },
          });
          notification.success();
          this.fetchSupplier();
          if (!isEmpty(supplierLineSelectedRows)) {
            this.setState({
              supplierLineSelectedRows: [],
              supplierLineSelectedRowKeys: [],
            });
          }
        }
      });
    }

    this.setState({
      supplierLineSelectedRows: [],
      supplierLineSelectedRowKeys: [],
    });
  }

  /**
   * 选中招标明细行数据
   *
   * @param {*} selectedRowKeys
   * @param {*} selectedRows
   * @memberof Update
   */
  @Bind()
  onItemLineRowChange(selectedRowKeys, selectedRows) {
    this.setState({
      itemLineSelectedRowKeys: selectedRowKeys,
      itemLineSelectedRows: selectedRows,
    });
  }

  /**
   * 多选供应商操作
   *
   * @memberof Update
   */
  onSupplierLineRowChange = (keys = [], rows = []) => {
    this.setState({
      supplierLineSelectedRowKeys: keys,
      supplierLineSelectedRows: rows,
    });
  };

  /**
   * 批量添加供应商选择
   *
   * @param {*} [keys=[]]
   * @param {*} [rows=[]]
   * @memberof Update
   */
  @Bind()
  onBatchSupplierRowChange(keys = [], rows = []) {
    this.setState({
      batchSupplierSelectRowKeys: keys,
      batchSupplierSelectRows: rows,
    });
  }

  /**
   * 多选招标小组
   *
   * @memberof Update
   */
  onBidMemberRowChange = (keys = [], rows = []) => {
    this.setState({
      bidMemberSelectedRowKeys: keys,
      bidMemberSelectedRows: rows,
    });
  };

  /**
   * 专家行选择
   *
   * @param {*} [keys=[]]
   * @param {*} [rows=[]]
   * @memberof Update
   */
  @Bind()
  onExpertRowChange(keys = [], rows = []) {
    this.setState({
      expertLineSelectedRowKeys: keys,
      expertLineSelectedRows: rows,
    });
  }

  /**
   * 整体保存时整理招标明细
   */
  getItemLineSaveDate(itemLine) {
    const bidItemLines = getEditTableData(itemLine, ['bidLineItemId']);
    return bidItemLines;
  }

  /**
   * 校验数据是否必填，统计错误数
   *
   * @param {*} [dataList=[]]
   * @returns
   * @memberof Update
   */
  getDataErrNums(dataList = []) {
    let errNums = 0;
    if (!dataList.length) {
      return errNums;
    }
    dataList.forEach(data => {
      if (!data.length) {
        return;
      }

      const formData = getEditTableData(data);
      if (!formData.length && data) {
        ++errNums;
      }
    });

    return errNums;
  }

  /**
   * 获取需要保存和发布的data
   *
   * @param {*} values
   * @returns
   * @memberof Update
   */
  getBidAllData(values) {
    const {
      form,
      organizationId,
      bidHall: {
        header = {},
        supplierLine = [],
        itemLine = [],
        scoringBusinessExpert = [],
        scoringTechnologyExpert = [],
        scoringNoneExpert = [],
        scoringNoneTempelate = [],
        scoringBusinessTempelate = [],
        scoringTechnologyTempelate = [],
      },
    } = this.props;
    const { bidHeaderId, tenantId, bidStatus } = header;
    const {
      prequalEndDate = undefined,
      prequalLocation = '',
      reviewMethod,
      qualifiedLimit = '',
      fileFreeFlag = 0,
      prequalFileExpense,
      prequalRemark,
      enableScoreFlag,
      prequalAttachmentUuid = '',
      noticeNum = '',
      noticeStatus = '',
      noticeAttachmentUuid = '',
      remark = '',
      noticeId = null,
      noticeObjectVersionNumber = 0,
    } = form.getFieldsValue();

    // supplier
    const bidSuppliers = getEditTableData(supplierLine, ['bidLineSupplierId']);

    // bidLineItems
    const oldBidLineItems = this.getItemLineSaveDate(itemLine) || [];
    const bidLineItems = oldBidLineItems.map(item => {
      return {
        ...item,
        demandDate: item.demandDate ? item.demandDate.format(DATETIME_MIN) : undefined,
      };
    });

    // prequal
    const prequalHeader = {
      rfxHeaderId: bidHeaderId,
      tenantId,
      prequalEndDate: prequalEndDate ? prequalEndDate.format(DEFAULT_DATETIME_FORMAT) : undefined,
      prequalLocation,
      reviewMethod,
      qualifiedLimit,
      fileFreeFlag,
      prequalFileExpense,
      prequalRemark,
      enableScoreFlag,
      prequalHeaderId: header.prequalHeaderId,
      prequalAttachmentUuid,
      prequalCategory: 'BID',
      objectVersionNumber: header.prequalObjectVersionNumber,
      prequalUserId: header.prequalUserId,
    };

    // 专家
    const evaluateExperts =
      !scoringBusinessExpert.length && !scoringTechnologyExpert.length && !scoringNoneExpert.length
        ? {}
        : {
            business: getEditTableData(scoringBusinessExpert, ['evaluateExpertId']),
            technology: getEditTableData(scoringTechnologyExpert, ['evaluateExpertId']),
            nones: getEditTableData(scoringNoneExpert, ['evaluateExpertId']),
          };

    // 评分要素
    const evaluateIndics = [
      ...getEditTableData(scoringBusinessTempelate, ['evaluateIndicId']),
      ...getEditTableData(scoringTechnologyTempelate, ['evaluateIndicId']),
      ...getEditTableData(scoringNoneTempelate, ['evaluateIndicId']),
    ];

    // 招标公告
    const sourceNotice = {
      noticeNum,
      noticeStatus,
      noticeAttachmentUuid,
      remark,
      noticeId,
      objectVersionNumber: noticeObjectVersionNumber,
    };

    // 提交错误统计 (新增功能)
    const errNums = this.getDataErrNums([
      itemLine,
      scoringBusinessExpert,
      scoringTechnologyExpert,
      scoringNoneExpert,
      scoringBusinessTempelate,
      scoringTechnologyTempelate,
      scoringNoneTempelate,
      supplierLine,
    ]);

    return {
      organizationId,
      bidHeader: {
        ...values,
        quotationStartDate: values.quotationStartDate
          ? values.quotationStartDate.format(DEFAULT_DATETIME_FORMAT)
          : undefined,
        quotationEndDate: values.quotationEndDate
          ? values.quotationEndDate.format(DEFAULT_DATETIME_FORMAT)
          : undefined,
        bidOpenDate: values.bidOpenDate
          ? values.bidOpenDate.format(DEFAULT_DATETIME_FORMAT)
          : undefined,
        demandDate: values.demandDate
          ? values.demandDate.format(DEFAULT_DATETIME_FORMAT)
          : undefined,
        bidStatus,
      },
      bidLineSuppliers: bidSuppliers || '',
      bidLineItems,
      prequalHeader,
      evaluateExperts,
      evaluateIndics,
      sourceNotice,
      errNums,
    };
  }

  /**
   * 必填字段提示
   *
   * @param {*} [err={}]
   * @returns
   * @memberof Update
   */
  warningRequiredFields(err = {}) {
    const ErrKeys = Object.keys(err);
    if (!ErrKeys.length) {
      return;
    }

    const msgs = [];
    ErrKeys.forEach(key => {
      const errMsg = err[key].errors[0].message; // 现在只拿错误的第一条消息提醒用户
      if (!errMsg) {
        return;
      }
      msgs.push(errMsg);
    });

    notification.warning({
      message: (
        <>
          {msgs.map(item => {
            return <div>{item}</div>;
          })}
        </>
      ),
    });
  }

  /**
   * 招标维护全保存
   *
   * @memberof Update
   */
  @Bind()
  handleSaveBidHall() {
    const { dispatch, form } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (isEmpty(err)) {
        const { errNums = 0, ...others } = this.getBidAllData(values);

        if (errNums) {
          notification.warning({
            message: intl
              .get(`${promptCode}.modal.bidHall.theFieldsNotComplete`)
              .d('字段没有全部填写!'),
          });
          return;
        }

        dispatch({
          type: 'bidHall/savebidHallUpdate',
          payload: others,
        }).then(res => {
          if (res) {
            notification.success();
            this.refreshCache();
          }
        });
      } else {
        this.warningRequiredFields(err);
      }
    });
  }

  /**
   * 发布招标
   *
   * @memberof Update
   */
  @Bind()
  handleReleaseBidHall() {
    const { dispatch, form } = this.props;

    form.validateFields((err, values) => {
      if (isEmpty(err)) {
        const { errNums = 0, ...others } = this.getBidAllData(values);

        if (errNums) {
          notification.warning({
            message: intl
              .get(`${promptCode}.modal.bidHall.theFieldsNotComplete`)
              .d('字段没有全部填写!'),
          });
          return;
        }

        dispatch({
          type: 'bidHall/releasebidHall',
          payload: others,
        }).then(res => {
          if (res) {
            notification.success();
            dispatch(
              routerRedux.push({
                pathname: `/ssrc/bid-hall/list`,
              })
            );
          }
        });
      } else {
        notification.warning({
          message: intl
            .get(`${promptCode}.modal.bidHall.theFieldsNotComplete`)
            .d('字段没有全部填写!'),
        });
      }
    });
  }

  /**
   * 招标小组 改变用户名
   *
   * @param {*} val
   * @param {*} dataList
   * @param {*} record
   * @returns
   * @memberof Update
   */
  @Bind()
  changeLoginName(val, dataList, record) {
    if (!val) {
      return;
    }

    const { email, id, phone, loginName, realName } = dataList;

    record.$form.setFieldsValue({
      email,
      userId: id,
      phone,
      loginName,
      userName: realName,
    });
  }

  refreshCache() {
    this.fetchbidHallUpdate();
  }

  /**
   * 创建专家评分
   *
   * @param {string} [type='']
   * @memberof Update
   */
  @Bind()
  onCreateLine(type = '') {
    const {
      organizationId,
      dispatch,
      bidHall: { header, scoringNoneExpert, scoringBusinessExpert, scoringTechnologyExpert },
    } = this.props;

    const newPayload = [
      {
        userName: undefined,
        expertName: undefined,
        expertId: undefined,
        tenantId: header.tenantId,
        evaluateExpertId: uuidv4(),
        sourceFrom: 'BID',
        leaderFlag: 0,
        openBidOrder: header.openBidOrder,
        organizationId,
        sourceHeaderId: header.bidHeaderId,
        expertStatus: 'SUBMITTED',
        _status: 'create',
      },
    ];

    switch (type) {
      case 'BUSINESS':
        dispatch({
          type: 'bidHall/updateState',
          payload: {
            scoringBusinessExpert: [...newPayload, ...scoringBusinessExpert],
          },
        });
        break;

      case 'TECHNOLOGY':
        dispatch({
          type: 'bidHall/updateState',
          payload: {
            scoringTechnologyExpert: [...newPayload, ...scoringTechnologyExpert],
          },
        });
        break;

      default:
        dispatch({
          type: 'bidHall/updateState',
          payload: {
            scoringNoneExpert: [...newPayload, ...scoringNoneExpert],
          },
        });
        break;
    }
  }

  /**
   * 保存专家评分
   *
   * @param {*} type
   * @returns
   * @memberof Update
   */
  @Bind()
  onSaveExpert(type) {
    const {
      organizationId,
      dispatch,
      bidHall: { scoringNoneExpert, scoringBusinessExpert, scoringTechnologyExpert },
    } = this.props;

    this.setState({
      expertSaveType: type,
    });

    let business = [];
    let technology = [];
    let nones = [];

    switch (type) {
      case 'BUSINESS':
        business = getEditTableData(scoringBusinessExpert, ['evaluateExpertId']);
        break;
      case 'TECHNOLOGY':
        technology = getEditTableData(scoringTechnologyExpert, ['evaluateExpertId']);
        break;
      default:
        nones = getEditTableData(scoringNoneExpert, ['evaluateExpertId']);
        break;
    }

    dispatch({
      type: 'bidHall/saveScoringNoneExpert',
      payload: {
        organizationId,
        evaluateExperts: {
          business,
          technology,
          nones,
        },
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchExpert();
        this.setState({ expertLineSelectedRows: [] });
      }
    });
  }

  /**
   * 评分要素-删除 筛选本地且不删除的数据
   *
   * @param {*} data
   * @returns
   * @memberof Update
   */
  filterExpertsUnSelectedOldData(data) {
    const { expertLineSelectedRows } = this.state;
    const sourceData = filter(data, item => {
      return (
        expertLineSelectedRows &&
        expertLineSelectedRows.map(id => id.evaluateExpertId).indexOf(item.evaluateExpertId) < 0
      );
    });

    return sourceData;
  }

  /**
   * 批量删除专家评分
   *
   * @param {*} types
   * @returns
   * @memberof Update
   */
  @Bind()
  onDeleteExpert(types) {
    const {
      organizationId,
      dispatch,
      bidHall: { scoringNoneExpert, scoringBusinessExpert, scoringTechnologyExpert },
    } = this.props;

    const { expertLineSelectedRows } = this.state;
    if (isEmpty(expertLineSelectedRows)) {
      return;
    }

    let sourceData = [];
    switch (types) {
      case 'BUSINESS':
        sourceData = this.filterExpertsUnSelectedOldData(scoringBusinessExpert);
        break;
      case 'TECHNOLOGY':
        sourceData = this.filterExpertsUnSelectedOldData(scoringTechnologyExpert);
        break;
      default:
        sourceData = this.filterExpertsUnSelectedOldData(scoringNoneExpert);
        break;
    }

    Modal.confirm({
      title: intl.get('hzero.common.message.confirm.remove').d('确定删除选中数据?'),
      onOk: () => {
        const remoteDelete = [];
        expertLineSelectedRows.forEach(item => {
          if (item._status === 'update') {
            remoteDelete.push(item.evaluateExpertId);
          }
        });

        if (isEmpty(remoteDelete)) {
          switch (types) {
            case 'BUSINESS':
              dispatch({
                type: 'bidHall/updateState',
                payload: {
                  scoringBusinessExpert: sourceData,
                },
              });
              break;
            case 'TECHNOLOGY':
              dispatch({
                type: 'bidHall/updateState',
                payload: {
                  scoringTechnologyExpert: sourceData,
                },
              });
              break;
            default:
              dispatch({
                type: 'bidHall/updateState',
                payload: {
                  scoringNoneExpert: sourceData,
                },
              });
              break;
          }
          this.setState({ expertLineSelectedRows: [], expertLineSelectedRowKeys: [] });
        } else {
          dispatch({
            type: 'bidHall/deleteScoringNoneExpert',
            payload: { remoteDelete, organizationId },
          }).then(res => {
            if (res) {
              notification.success();
              this.fetchExpert();
              this.setState({ expertLineSelectedRows: [], expertLineSelectedRowKeys: [] });
            }
          });
        }
      },
      onCancel: () => {
        this.setState({ expertLineSelectedRows: [], expertLineSelectedRowKeys: [] });
      },
    });
  }

  /**
   * EditTable  选择评分要素
   *
   * @param {*} keys
   * @param {*} rows
   * @memberof Update
   */
  @Bind()
  onScoringLineChange(keys, rows) {
    this.setState({
      scoringElementSelectedRowKeys: keys,
      scoringElementSelectedRows: rows,
    });
  }

  /**
   * 增加评分要素数据段
   *
   * @param {*} type
   * @memberof Update
   */
  @Bind()
  onCreateScoringElements(type) {
    const {
      organizationId,
      dispatch,
      bidHall: {
        header,
        scoringNoneTempelate,
        scoringBusinessTempelate,
        scoringTechnologyTempelate,
      },
    } = this.props;

    const newPayload = [
      {
        evaluateIndicId: uuidv4(),
        tenantId: header.tenantId,
        indicateId: '',
        indicateCode: '',
        indicateName: '',
        indicateType: '',
        remark: '',
        weight: '',
        minScore: '',
        maxScore: '',
        sourceFrom: 'BID',
        openBidOrder: header.openBidOrder || 'BUSINESS_FIRST',
        organizationId,
        expertCategory: type,
        sourceHeaderId: header.bidHeaderId,
        indicStatus: 'SUBMITTED', // 查询提交后的评分要素数据
        _status: 'create',
      },
    ];

    switch (type) {
      case 'BUSINESS':
        dispatch({
          type: 'bidHall/updateState',
          payload: {
            scoringBusinessTempelate: [...newPayload, ...scoringBusinessTempelate],
          },
        });
        break;

      case 'TECHNOLOGY':
        dispatch({
          type: 'bidHall/updateState',
          payload: {
            scoringTechnologyTempelate: [...newPayload, ...scoringTechnologyTempelate],
          },
        });
        break;

      default:
        dispatch({
          type: 'bidHall/updateState',
          payload: {
            scoringNoneTempelate: [...newPayload, ...scoringNoneTempelate],
          },
        });
        break;
    }
  }

  /**
   * 保存评分要素
   *
   * @param {string} [type='']
   * @returns
   * @memberof Update
   */
  @Bind()
  onSaveScoringElements(type = '') {
    const {
      organizationId,
      dispatch,
      bidHall: { scoringNoneTempelate, scoringBusinessTempelate, scoringTechnologyTempelate },
    } = this.props;

    this.setState({
      scoringSaveType: type,
    });

    let newParams = [];
    switch (type) {
      case 'BUSINESS':
        newParams = getEditTableData(scoringBusinessTempelate, ['evaluateIndicId']);
        break;
      case 'TECHNOLOGY':
        newParams = getEditTableData(scoringTechnologyTempelate, ['evaluateIndicId']);
        break;
      default:
        newParams = getEditTableData(scoringNoneTempelate, ['evaluateIndicId']);
        break;
    }

    if (!newParams.length) {
      return;
    }

    dispatch({
      type: 'bidHall/saveScoringNoneTempelate',
      payload: {
        organizationId,
        newParams,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchScoring();
      }
    });
  }

  /**
   * 评分要素参考模板
   *
   * @param {*} values
   * @memberof Update
   */
  @Bind()
  onSelectTemplateOk(values) {
    const {
      organizationId,
      dispatch,
      bidHall: { header },
    } = this.props;

    const commonFields = {
      tenantId: header.tenantId,
      sourceFrom: 'BID',
      sourceHeaderId: header.bidHeaderId,
      openBidOrder: header.openBidOrder || 'SYNC',
    };

    const newParams = values.scoreIndics.map(item => {
      return { ...item, ...commonFields };
    });

    dispatch({
      type: 'bidHall/saveScoringNoneTempelate',
      payload: {
        organizationId,
        newParams,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchScoring();
      }
    });
  }

  /**
   * 保存评分模板
   *
   * @param {*} record
   * @memberof Update
   */
  @Bind()
  saveAllScoringTemplate(record) {
    const {
      organizationId,
      dispatch,
      bidHall: { header },
    } = this.props;

    dispatch({
      type: 'bidHall/saveAllScoringTemplate',
      payload: {
        organizationId,
        sourceHeaderId: header.bidHeaderId,
        sourceFrom: 'BID',
        templateId: record.templateId,
        indicStatus: 'SUBMITTED',
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchScoring();
      }
    });
  }

  /**
   * 评分要素-专家分配 保存
   *
   * @memberof Update
   */
  @Bind()
  saveScoringAssignExpert() {
    const {
      organizationId,
      dispatch,
      bidHall: { currentScoringExperts = [] },
    } = this.props;

    const newParams = getEditTableData(currentScoringExperts, 'evaluateExpertId');

    if (isEmpty(newParams)) {
      this.cancelAssignExpert();
    } else {
      dispatch({
        type: 'bidHall/saveEvaluateIndicAssign',
        payload: {
          organizationId,
          newParams,
        },
      }).then(res => {
        if (res) {
          notification.success();
        }
      });
    }
    this.cancelAssignExpert();
  }

  /**
   * 评分要素-专家分配 打开modal
   *
   * @param {*} record
   * @memberof Update
   */
  @Bind()
  openAssignExpertModal(record) {
    const { organizationId, dispatch } = this.props;

    this.setState({
      evaluateAssignModalVisible: true,
    });

    dispatch({
      type: 'bidHall/fetchEvaluateIndicAssign',
      payload: {
        organizationId,
        evaluateIndicId: record.evaluateIndicId || '',
        evaluateIndicCategory: record.team || '',
      },
    });
  }

  /**
   * 评分要素-专家分配 关闭modal
   *
   * @memberof Update
   */
  @Bind()
  cancelAssignExpert() {
    const { dispatch } = this.props;

    this.setState({
      evaluateAssignModalVisible: false,
    });

    dispatch({
      type: 'bidHall/updateState',
      payload: {
        currentScoringExperts: [],
      },
    });
  }

  /**
   * 评分要素-删除 筛选本地且不删除的数据
   *
   * @param {*} data
   * @returns 筛选后的数据
   * @memberof Update
   */
  filterScorinUnSelectedOldData(data) {
    const { scoringElementSelectedRows } = this.state;
    const sourceData = filter(data, item => {
      return (
        scoringElementSelectedRows &&
        scoringElementSelectedRows.map(id => id.evaluateIndicId).indexOf(item.evaluateIndicId) < 0
      );
    });

    return sourceData;
  }

  /**
   * 删除评分要素
   *
   * @param {*} types
   * @returns
   * @memberof Update
   */
  @Bind()
  onDeleteScoringElements(types) {
    const { scoringElementSelectedRows } = this.state;
    if (isEmpty(scoringElementSelectedRows)) {
      return;
    }

    const {
      organizationId,
      dispatch,
      bidHall: { scoringNoneTempelate, scoringBusinessTempelate, scoringTechnologyTempelate },
    } = this.props;
    let sourceData = [];

    switch (types) {
      case 'BUSINESS':
        sourceData = this.filterScorinUnSelectedOldData(scoringBusinessTempelate);
        break;
      case 'TECHNOLOGY':
        sourceData = this.filterScorinUnSelectedOldData(scoringTechnologyTempelate);
        break;
      default:
        sourceData = this.filterScorinUnSelectedOldData(scoringNoneTempelate);
        break;
    }

    Modal.confirm({
      title: intl.get('hzero.common.message.confirm.remove').d('确定删除选中数据?'),
      onOk: () => {
        const remoteDelete = [];
        scoringElementSelectedRows.forEach(item => {
          if (item._status === 'update') {
            remoteDelete.push(item.evaluateIndicId);
          }
        });

        if (isEmpty(remoteDelete)) {
          switch (types) {
            case 'BUSINESS':
              dispatch({
                type: 'bidHall/updateState',
                payload: {
                  scoringBusinessTempelate: sourceData,
                },
              });
              break;
            case 'TECHNOLOGY':
              dispatch({
                type: 'bidHall/updateState',
                payload: {
                  scoringTechnologyTempelate: sourceData,
                },
              });
              break;
            default:
              dispatch({
                type: 'bidHall/updateState',
                payload: {
                  scoringNoneTempelate: sourceData,
                },
              });
              break;
          }
          this.setState({ scoringElementSelectedRows: [], scoringElementSelectedRowKeys: [] });
        } else {
          dispatch({
            type: 'bidHall/deleteScoringNoneTempelate',
            payload: { remoteDelete, organizationId },
          }).then(res => {
            if (res) {
              notification.success();
              this.fetchScoring();
              this.setState({ scoringElementSelectedRows: [], scoringElementSelectedRowKeys: [] });
            }
          });
        }
      },
      onCancel: () => {
        this.setState({ scoringElementSelectedRows: [], scoringElementSelectedRowKeys: [] });
      },
    });
  }

  form;

  /**
   * 设置Form
   * @param {object} ref - BulkAddSupplier组件引用
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  render() {
    const {
      dispatch,
      match,
      form,
      organizationId,
      userId,
      releasebidHallLoading,
      fetchbidHallUpdateLoading,
      fetchItemLineLoading,
      savebidHallUpdateLoading,
      saveItemLineLoading,
      fetchSupplierLineloading,
      fetchBulkSupplierDataLoading,
      saveScoringNoneExpertLoading,
      fetchTempelateDetailDataLoading,
      saveScoringNoneTempelateLoading,
      fetchEvaluateIndicAssignLoading,
      fetchScoringElementLoading,
      saveScoringElementLoading,
      saveBidMembersLoading,
      supplierRecordLoading,
      bidHall: {
        header = {},
        itemLine = [],
        itemLineExpandedKeys = [],
        supplierLine = [],
        supplierLinePagination = {},
        bidMembersList = [],
        supplierData = [],
        code: {
          bidRoles = [],
          indicateType = [],
          subjectMatterRules = [],
          sourceMethods = [],
          quotationTypes = [],
          sourceStages = [],
          reviewMethods = [],
        },
        bulkSupplierList = [],
        bulkSupplierListPagination = {},
        scoringNoneExpert = [],
        scoringBusinessExpert = [],
        scoringTechnologyExpert = [],
        scoringNoneTempelate = [],
        scoringBusinessTempelate = [],
        scoringTechnologyTempelate = [],
        currentScoringExperts = [],
        scoringElement = [],
      },
    } = this.props;

    const {
      bidMemberSelectedRows = [],
      bidMemberSelectedRowKeys = [],
      distributeModalVisible,
      subjectMatterRule,
      sourceMethod,
      itemLineSelectedRows = [],
      itemLineSelectedRowKeys = [],
      supplierLineSelectedRows = [],
      supplierLineSelectedRowKeys = [],
      batchSupplierSelectRowKeys,
      editBidMembersFlag,
      batchOperateSupplierModelVisible,
      expertLineSelectedRows,
      expertLineSelectedRowKeys,
      scoringElementSelectedRows,
      scoringElementSelectedRowKeys,
      evaluateAssignModalVisible,
      scoringElementVisible,
      scoringSaveType,
      expertSaveType,
      collapseKeys,
      localExpertScoreType = '',
      localPreQualificationFlag = 0,
    } = this.state;

    // 基本信息props
    const infoProps = {
      header,
      organizationId,
      form,
      subjectMatterRules,
      sourceMethods,
      quotationTypes,
      sourceStages,
      changeTemplateId: this.changeTemplateId,
      changeSourceMethod: this.changeSourceMethod,
      changeCompany: this.changeCompany,
      changeSubjectMatterRule: this.changeSubjectMatterRule,
      editBidMembers: this.editBidMembers,
    };

    // other props
    const otherProps = {
      header,
      organizationId,
      form,
      changeBidSourcePlan: this.changeBidSourcePlan,
      changeProjectInfo: this.changeProjectInfo,
      setValue: this.setValue,
      changePaymentType: this.changePaymentType,
    };

    // qualification props
    const qualificationProps = {
      header,
      organizationId,
      form,
      reviewMethods,
      changeReviewMethod: this.changeReviewMethod,
      changeScoreFlag: this.changeReviewMethod,
      showScoringElement: this.showScoringElement,
    };

    const itemLineRowSelection = {
      selectedRowKeys: itemLineSelectedRowKeys,
      selectedRows: itemLineSelectedRows,
      onChange: this.onItemLineRowChange,
    };

    const expertLineRowSelection = {
      expertLineSelectedRows,
      expertLineSelectedRowKeys,
      onChange: this.onExpertRowChange,
    };

    // 物品明细
    const ItemLineTableProps = {
      sourceMethod,
      match,
      dispatch,
      organizationId,
      subjectMatterRule: subjectMatterRule || header.subjectMatterRule,
      itemLineRowSelection,
      itemLineSelectedRows,
      itemLineSelectedRowKeys,
      itemLineExpandedKeys,
      handleExpandRow: this.handleExpandRow,
      loading: fetchItemLineLoading,
      saveLoading: saveItemLineLoading || fetchItemLineLoading,
      dataSource: itemLine,
      onCreateLine: this.createItemLine,
      onCreateItemLineSon: this.createItemLineSon,
      onDistributeSupplierForItemLine: this.onDistributeSupplierForItemLine,
      distributeSupplierForItemLIne: this.distributeSupplierForItemLIne,
      cancelDistribute: this.cancelDistribute,
      distributeModalVisible,
      supplierData,
      onSaveLine: this.saveItemLine,
      onDeleteLines: this.deleteItemLines,
      onChangeTableData: this.changeItemLineTableData,
      supplierRecordLoading,
    };

    // 专家
    const ProfessionalTableProps = {
      header,
      expertSaveType,
      scoringNoneExpert,
      scoringBusinessExpert,
      scoringTechnologyExpert,
      dispatch,
      organizationId,
      match,
      subjectMatterRule,
      expertLineSelectedRows,
      expertLineSelectedRowKeys,
      saveLoading: saveScoringNoneExpertLoading,
      fetchbidHallUpdateLoading,
      expertLineRowSelection,
      onSaveExpert: this.onSaveExpert,
      onCreateLine: this.onCreateLine,
      onDeleteExpert: this.onDeleteExpert,
    };

    // 评分要素选择
    const scoringLineRowSelection = {
      scoringElementSelectedRows,
      onChange: this.onScoringLineChange,
    };

    // 评分要素
    const ScoringElementsTableProps = {
      loading: fetchTempelateDetailDataLoading,
      header,
      scoringSaveType,
      scoringNoneTempelate,
      scoringBusinessTempelate,
      scoringTechnologyTempelate,
      dispatch,
      evaluateAssignModalVisible,
      organizationId,
      match,
      currentScoringExperts,
      saveLoading: saveScoringNoneTempelateLoading,
      scoringLineRowSelection,
      scoringElementSelectedRowKeys,
      onSaveScoringElements: this.onSaveScoringElements,
      onCreateScoringElements: this.onCreateScoringElements,
      onDeleteScoringElements: this.onDeleteScoringElements,
      onSelectTemplateOk: this.onSelectTemplateOk,
      saveAllScoringTemplate: this.saveAllScoringTemplate,
      saveScoringAssignExpert: this.saveScoringAssignExpert,
      openAssignExpertModal: this.openAssignExpertModal,
      cancelAssignExpert: this.cancelAssignExpert,
      fetchEvaluateIndicAssignLoading,
    };

    const SupplierLineRowSelection = {
      selectedRowKeys: supplierLineSelectedRowKeys,
      onChange: this.onSupplierLineRowChange,
    };

    // 批量选择供应商
    const batchSupplierRowSelection = {
      selectedRowKeys: batchSupplierSelectRowKeys,
      onChange: this.onBatchSupplierRowChange,
    };

    // 供应商
    const SupplierLineTableProps = {
      dispatch,
      organizationId,
      userId,
      companyId: header.companyId,
      match,
      form,
      fetchbidHallUpdateLoading,
      loading: fetchSupplierLineloading,
      loadingSupplierLov: fetchBulkSupplierDataLoading,
      SupplierLineRowSelection,
      batchSupplierSelectRowKeys,
      batchSupplierRowSelection,
      supplierLineSelectedRows,
      supplierLineSelectedRowKeys,
      dataSource: supplierLine,
      onSaveLine: this.saveSupplierLine,
      onDeleteLines: this.deleteSupplierLine,
      sourceMethod: sourceMethod || header.sourceMethod,
      onCreateLine: this.createSupplierLine,
      batchAddBidSupplier: this.batchAddBidSupplier,
      cancelBatchOperate: this.cancelBatchOperate,
      batchOperateSupplierModelVisible,
      openBatchAddModel: this.openBatchAddModel,
      onSearchBulkSupplier: this.fetchSupplierList,
      onRef: this.handleBindRef,
      bulkSupplierList,
      bulkSupplierListPagination,
      pagination: supplierLinePagination,
    };

    // 选择招标细项
    const scoringElementRowSelection = {
      selectedRowKeys:
        scoringElementSelectedRows &&
        scoringElementSelectedRows.map(item => item.prequalScoreAssignId),
      onChange: this.handleScoringElementRowSelectChange,
    };

    // 招标细项props
    const scoringElementProps = {
      header,
      indicateType,
      scoringElementSelectedRows,
      rowSelection: scoringElementRowSelection,
      loading: fetchScoringElementLoading,
      visible: scoringElementVisible,
      dataSource: scoringElement,
      saveScoringElementLoading,
      onCreateLine: this.handleCreateScoringElement,
      onDeleteLine: this.handleDeleteScoringElement,
      onSaveLine: this.handleSaveScoringElement,
      onCancel: this.handleCancelScoringElement,
      onSelectTemplateOk: this.handleSelectTemplateOk,
    };

    const bidMemberRowSelection = {
      bidMemberSelectedRows,
      selectedRowKeys: bidMemberSelectedRowKeys,
      onChange: this.onBidMemberRowChange,
      getCheckboxProps: record => ({
        disabled: record.defaultFlag,
        defaultFlag: record.defaultFlag,
      }),
    };

    // bid member props
    const bidMemberProps = {
      header,
      organizationId,
      form,
      bidRoles,
      bidMembersList,
      bidMemberRowSelection,
      editBidMembersFlag,
      bidMemberSelectedRowKeys,
      changeLoginName: this.changeLoginName,
      saveBidMembersLoading,
      handleMembersDelete: this.handleMembersDelete,
      handleMembersCreate: this.handleMembersCreate,
      handleMembersCancel: this.handleMembersCancel,
      handleMembersSave: this.handleMembersSave,
    };

    // 招标公告
    const TenderNoticeProps = {
      form,
      header,
      organizationId,
    };

    return (
      <React.Fragment>
        <Header
          backPath="/ssrc/bid-hall/list"
          title={intl.get(`${promptCode}.view.message.title.bidMaintenance`).d('招标书维护')}
        >
          <Button
            icon="save"
            type="primary"
            onClick={this.handleSaveBidHall}
            loading={savebidHallUpdateLoading}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <Button
            icon="rocket"
            type="default"
            loading={releasebidHallLoading}
            onClick={this.handleReleaseBidHall}
          >
            {intl.get('hzero.common.button.release').d('发布')}
          </Button>
        </Header>
        <Content
          className={classnames(common['page-content-custom'], 'ued-detail-wrapper')}
          style={{ marginBottom: '16px' }}
        >
          <Spin spinning={fetchbidHallUpdateLoading}>
            <Collapse
              className="form-collapse"
              onChange={this.onCollapseChange}
              defaultActiveKey={['baseInfos']}
            >
              <Panel
                showArrow={false}
                header={
                  <React.Fragment>
                    <h3>
                      {header.bidNum} —
                      {intl.get(`${promptCode}.view.message.tab.bidMaintain`).d('招标维护')}
                    </h3>
                    <a>
                      {collapseKeys.includes('baseInfos')
                        ? intl.get(`hzero.common.button.up`).d('收起')
                        : intl.get(`hzero.common.button.expand`).d('展开')}
                    </a>
                    <Icon type={collapseKeys.includes('baseInfos') ? 'up' : 'down'} />
                  </React.Fragment>
                }
                key="baseInfos"
              >
                <Tabs defaultActiveKey="baseInfos" animated={false}>
                  <Tabs.TabPane
                    tab={intl.get(`${promptCode}.view.message.tab.baseInfos`).d('基本信息')}
                    key="baseInfos"
                  >
                    <BidInfoForm {...infoProps} />
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    tab={intl.get(`${promptCode}.view.message.tab.otherInfos`).d('其他信息')}
                    key="otherInfos"
                    forceRender
                  >
                    <BidOtherForm {...otherProps} />
                  </Tabs.TabPane>
                  {localPreQualificationFlag !== 0 ? (
                    <Tabs.TabPane
                      tab={intl
                        .get(`${promptCode}.view.message.tab.preQualification`)
                        .d('资格预审')}
                      key="preQualification"
                      forceRender
                    >
                      <QualificationForm {...qualificationProps} />
                    </Tabs.TabPane>
                  ) : (
                    ''
                  )}
                  {localExpertScoreType && localExpertScoreType === 'ONLINE' ? (
                    <Tabs.TabPane
                      tab={intl.get(`${promptCode}.view.message.tab.professional`).d('专家')}
                      key="professional"
                      forceRender
                    >
                      <ProfessionalTable {...ProfessionalTableProps} />
                    </Tabs.TabPane>
                  ) : (
                    ''
                  )}
                  {localExpertScoreType && localExpertScoreType === 'ONLINE' ? (
                    <Tabs.TabPane
                      tab={intl.get(`${promptCode}.view.message.tab.scoringElements`).d('评分要素')}
                      key="scoringElements"
                      forceRender
                    >
                      <ScoringElementsTable {...ScoringElementsTableProps} />
                    </Tabs.TabPane>
                  ) : (
                    ''
                  )}
                  <Tabs.TabPane
                    tab={intl.get(`${promptCode}.view.message.tab.supplierList`).d('供应商列表')}
                    key="supplierList"
                    forceRender
                  >
                    <SupplierLineTable {...SupplierLineTableProps} />
                  </Tabs.TabPane>
                  {sourceMethod && sourceMethod !== 'INVITE' ? (
                    <Tabs.TabPane
                      tab={intl.get(`${promptCode}.view.message.tab.tenderNotice`).d('招标公告')}
                      key="tenderNotice"
                      forceRender
                    >
                      <TenderNoticeForm {...TenderNoticeProps} />
                    </Tabs.TabPane>
                  ) : (
                    ''
                  )}
                </Tabs>
              </Panel>
            </Collapse>
          </Spin>
          <ItemLineTable {...ItemLineTableProps} />
        </Content>

        <BidMemberForm {...bidMemberProps} />
        <ScoringElementModal {...scoringElementProps} />
      </React.Fragment>
    );
  }
}
