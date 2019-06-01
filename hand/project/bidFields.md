    @ApiModelProperty("表ID，主键，供其他表做外键")
    @Id
    @GeneratedValue
    private Long bidHeaderId;
    @ApiModelProperty(value = "所属租户ID，hpfm_tenant.tenant_id")
    @NotNull
    private Long tenantId;
    @ApiModelProperty(value = "招标编号")
    @NotBlank
    private String bidNum;
    @ApiModelProperty(value = "招标书状态SSRC.BID_STATUS(NEW/新建|RELEASE_APPROVING/发布审批中|RELEASE_REJECTED/发布审批拒绝|NOT_START/未开始|IN_PREQUAL/资格预审中|PREQUAL_CUTOFF/资格预审截止|IN_BIDDING/投标中|OPEN_BID_PENDING/待开标|SCORING/评分中|BID_EVALUATION_PENDING/待评标|CONFIRMED_PENDING/待中标结果确认|CHECK_REJECTED/核价审批拒绝|FINISHED/完成|CLOSED/关闭|ROUNDED/再次询价|IN_POSTQUAL/资格后审中|POSTQUAL_CUTOFF/资格后审截止)")
    @NotBlank
    private String bidStatus;
    @ApiModelProperty(value = "招标事项")
    @NotBlank
    private String bidTitle;
    @ApiModelProperty(value = "寻源模板ID")
    @NotNull
    private Long templateId;
    @ApiModelProperty(value = "评标方法ID")
    @NotNull
    private Long methodId;
    @ApiModelProperty(value = "寻源方式SSRC.SOURCE_METHOD(INVITE/邀请|OPEN/合作伙伴公开|ALL_OPEN/全平台公开)")
    @NotBlank
    private String sourceMethod;
   @ApiModelProperty(value = "招标类别ID")    
    private Long bidTypeId;
   @ApiModelProperty(value = "招标类别")    
    private String bidType;
   @ApiModelProperty(value = "采购方采购组织ID")    
    private Long purOrganizationId;
    @ApiModelProperty(value = "采购方企业ID")
    @NotNull
    private Long companyId;
    @ApiModelProperty(value = "采购方企业名称")
    @NotBlank
    private String companyName;
    @ApiModelProperty(value = "报价方式SSRC.QUOTATION_TYPE")
    @NotBlank
    private String quotationType;
   @ApiModelProperty(value = "最大中标数")
    private Long maxBidNumber;
    @ApiModelProperty(value = "标的规则SSRC.SUBJECT_MATTER_RULE(PACK/分标段包|NONE/不区分)")
    @NotBlank
    private String subjectMatterRule;
    @ApiModelProperty(value = "开标时间")
    private Date bidOpenDate;
   @ApiModelProperty(value = "寻源计划ID")
    private Long bidPlanId;
    @ApiModelProperty(value = "项目Id , ssrc_project.project_id")
    private Long projectId;
   @ApiModelProperty(value = "项目地点")
    private String bidLocation;
    @ApiModelProperty(value = "招标文件免费标识")
    @NotNull
    private Integer fileFreeFlag;
    @ApiModelProperty(value = "招标文件费")
    private BigDecimal bidFileExpense;
    @ApiModelProperty(value = "招标保证金")
    private BigDecimal bidBond;
    @ApiModelProperty(value = "开标地点")
    private String bidOpenLocation;
    @ApiModelProperty(value = "含税标识")
    @NotNull
    private Integer taxIncludedFlag;
    @ApiModelProperty(value = "币种ID")
    @NotNull
    private Long currencyId;
    @ApiModelProperty(value = "币种")
    @NotBlank
    private String currencyCode;
   @ApiModelProperty(value = "汇率")
    private Long exchangeRateId;
   @ApiModelProperty(value = "汇率类型")
    private String exchangeRateType;
   @ApiModelProperty(value = "汇率日期")
    private Date exchangeRateDate;
   @ApiModelProperty(value = "汇率期间")
    private String exchangeRatePeriod;
   @ApiModelProperty(value = "汇率")
    private BigDecimal exchangeRate;
   @ApiModelProperty(value = "投标开始时间")
    private Date quotationStartDate;
   @ApiModelProperty(value = "投标截止时间")
    private Date quotationEndDate;
    @ApiModelProperty(value = "当前专家评分组别")
    @NotNull
    private Integer currentSequenceNum;
    @ApiModelProperty(value = "寻源类型SSRC.SOURCE_TYPE(NORMAL/常规|OEM/OEM|PROJECT/项目|OUTSOURCE/外协|CONSIGN/寄售)")
    @NotBlank
    private String sourceType;
    @ApiModelProperty(value = "价格类型SSRC.SOURCE_PRICE_CATEGORY(STANDARD/标准|SAMPLE/样品)")
    @NotBlank
    private String priceCategory;
    @ApiModelProperty(value = "付款条款")
    private String paymentTerm;
    @ApiModelProperty(value = "轮次")
    @NotNull
    private Long roundNumber;
    @ApiModelProperty(value = "版本")
    @NotNull
    private Long versionNumber;
   @ApiModelProperty(value = "发布日期")
    private Date releasedDate;
   @ApiModelProperty(value = "发布人")
    private Long releasedBy;
   @ApiModelProperty(value = "审批日期")
    private Date approvedDate;
   @ApiModelProperty(value = "审批结果")
    private Integer approvalResultFlag;
   @ApiModelProperty(value = "审批人")
    private Long approvedBy;
   @ApiModelProperty(value = "审批备注")
    private String approvedRemark;
    @ApiModelProperty(value = "结束标志")
    @NotNull
    private Integer finishedFlag;
    @ApiModelProperty(value = "单据来源SSRC.DOC_SOURCE(MANUAL/手工创建|DEMAND_POOL/需求池|COPY/复制)")
    @NotBlank
    private String sourceFrom;
    @ApiModelProperty(value = "已开标标识")
    @NotNull
    private Integer openedFlag;
   @ApiModelProperty(value = "总成本")
    private BigDecimal totalCost;
   @ApiModelProperty(value = "成本备注")
    private String costRemark;
   @ApiModelProperty(value = "技术附件UUID")
    private String techAttachmentUuid;
   @ApiModelProperty(value = "商务附件UUID")
    private String businessAttachmentUuid;