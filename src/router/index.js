import Vue from 'vue'
import Router from 'vue-router'

import index from '@/components/index'
import login from '@/components/login'

//代理商管理
import agentaccountmanage from '@/components/agentmanagement/agentaccountmanage' //1
import AgentList from '@/components/agentmanagement/AgentList' //2
import RefereeList from '@/components/agentmanagement/RefereeList' //3
//网吧业务管理
import NetBarList1 from '@/components/NetBarList/NetBarList1' //3
import NetManagement from '@/components/NetBarList/NetManagement'
import InformationManagement from '@/components/NetBarList/InformationManagement'
import OfflineRecordingofInternetCafe from '@/components/NetBarList/OfflineRecordingofInternetCafe'//网吧离线记录
import StateStatistics from '@/components/NetBarList/StateStatistics'
import VersionManagement from '@/components/NetBarList/VersionManagement' //客户端版本管理
import VersionLog from '@/components/NetBarList/VersionLog' //网吧版本日志
import InternetBarAppreciation from '@/components/NetBarList/InternetBarAppreciation' //网吧主页增值管理
import ValueAddedSettings from '@/components/NetBarList/ValueAddedSettings' //网吧主页增值设置

//奖品统计
import ExchangeStatistics from '@/components/PrizesStatistics/ExchangeStatistics' //网吧领取兑换统计
import CollectionRecords from '@/components/PrizesStatistics/CollectionRecords' //领取兑换记录

//活动管理
import ActivityStatistics from '@/components/ActivityManagement/ActivityStatistics' //活动统计
import PrizeSetting from '@/components/ActivityManagement/PrizeSetting' //奖品设置

//赚取灵石管理
import LingshiStatistics from '@/components/LingshiManagement/LingshiStatistics' //赚取灵石统计
import TaskSettings from '@/components/LingshiManagement/TaskSettings' //赚取任务设置

//竞猜管理
import QuizStatistics from '@/components/Competitiveguess/QuizStatistics' //游戏竞猜统计
import QuizMode from '@/components/Competitiveguess/QuizMode' //竞猜模式设置
import CompetitiveOrder from '@/components/Competitiveguess/CompetitiveOrder' //竞猜订单管理

//战绩排名管理
import PUBGrankingsettings from '@/components/RankingOfAchievements/PUBGrankingsettings' //绝地求生积分排行设置
import StatisticsofAchievements from '@/components/RankingOfAchievements/StatisticsofAchievements' //战绩排名统计
import RankingRegionalAchievements from '@/components/RankingOfAchievements/RankingRegionalAchievements' //区域战绩排名设置
import TopRankManagement from '@/components/RankingOfAchievements/TopRankManagement' //总榜战绩排名管理
import CompetitionAwardManagement from '@/components/RankingOfAchievements/CompetitionAwardManagement' //比赛领奖管理

//用户管理
import UserInformation from '@/components/UserManagement/UserInformation' //用户信息管理
import UserMessageManagement from '@/components/UserManagement/UserMessageManagement' //用户消息管理
import UserLoginog from '@/components/UserManagement/UserLoginog' //用户登陆日志
import Feedback from '@/components/UserManagement/Feedback' //意见反馈
import LingshiManagement from '@/components/UserManagement/LingshiManagement' //灵石管理
import LuckyDraw from '@/components/UserManagement/LuckyDraw' //积分抽奖设置
import LuckyList from '@/components/UserManagement/LuckyList' //积分抽奖记录

//网吧财务管理
import PaymentRecord from '@/components/financialManagement/PaymentRecord' //网吧支付记录
import InternetCafebill from '@/components/financialManagement/InternetCafebill' //网吧账单

//业务统计
import Terminaldaily from '@/components/BusinessTotal/Terminaldaily'
import dlsGetBill from '@/components/BusinessTotal/dlsGetBill'
import dlsBillDetail from '@/components/BusinessTotal/dlsBillDetail'
import dlsCostBill from '@/components/BusinessTotal/dlsCostBill'
import BarBill from '@/components/BusinessTotal/BarBill'
import TerminalTotal from '@/components/BusinessTotal/TerminalTotal'
import BarBillConsume from '@/components/BusinessTotal/BarBillConsume'
import InternetbarTerminal from '@/components/BusinessTotal/InternetbarTerminal' //网吧激活终端统计
// import DailyBill from '@/components/BusinessTotal/DailyBill'

//市场CRM管理
import MarketPerformance from '@/components/MarketCRMManagement/MarketPerformance' //市场业绩管理
import AgentTerminal from '@/components/MarketCRMManagement/AgentTerminal' //代理商终端管理
import MonthlySettlementBills from '@/components/MarketCRMManagement/MonthlySettlementBills' //单桌标有效终端月账单
import AgencySettlementBills from '@/components/MarketCRMManagement/AgencySettlementBills' //单桌标结算终端代理商账单
import AgencyMonthlySettlementBills from '@/components/MarketCRMManagement/AgencyMonthlySettlementBills' //单桌标结算记录


//代理商登陆日志
import ReginLog1 from '@/components/dlsReginLog/ReginLog1'
import error from '@/components/dlsReginLog/error'
//财务相关
import yjSet from '@/components/Money/yjSet'
import czManner from '@/components/Money/czManner'
import cpxsTotal from '@/components/Money/cpxsTotal'
import dlsyuer from '@/components/Money/dlsyuer'
import tixianManner from '@/components/Money/tixianManner'
import dzyjManner from '@/components/Money/dzyjManner'
import consumerecord from '@/components/Money/consumerecord'
import accountCheck from '@/components/Money/accountCheck'
//业务功能设置
import zhiruBannerSet from '@/components/yewugongnengSet/zhiruBannerSet'
import sfzbSet from '@/components/yewugongnengSet/sfzbSet'
import zhuyeSet from '@/components/yewugongnengSet/zhuyeSet'
import AgentNews from '@/components/yewugongnengSet/AgentNews' //代理商消息公告管理
import InternetbarNews from '@/components/yewugongnengSet/InternetbarNews' //网吧消息公告管理
import NavigationConfiguration from '@/components/yewugongnengSet/NavigationConfiguration' //网吧消息公告管理
// steam特权钻石版管理
import steamtime from '@/components/steam/steamtime'
import steamorder from '@/components/steam/steamorder'
import GameInventory from '@/components/steam/GameInventory' //游戏库存不足
// 释放桌标点击量统计
import totalStatistics from '@/components/releaseStatistics/totalStatistics'
import dayStatistics from '@/components/releaseStatistics/dayStatistics'
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'index',
      component: index
    },

    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/error',
      name: 'error',
      component: error
    },
    {
      path: '/BarBillConsume',
      name: 'BarBillConsume',
      component: BarBillConsume
    },
    {
      path: '/InternetbarTerminal',
      name: 'InternetbarTerminal',
      component: InternetbarTerminal
    },
    {
      path: '/AgentTerminal',
      name: 'AgentTerminal',
      component: AgentTerminal
    },
    {
      path: '/MarketPerformance',
      name: 'MarketPerformance',
      component: MarketPerformance
    },
    {
      path: '/MonthlySettlementBills',
      name: 'MonthlySettlementBills',
      component: MonthlySettlementBills
    },
    {
      path: '/AgencySettlementBills',
      name: 'AgencySettlementBills',
      component: AgencySettlementBills
    },
    {
      path: '/AgencyMonthlySettlementBills',
      name: 'AgencyMonthlySettlementBills',
      component: AgencyMonthlySettlementBills
    },
    {
      //代理商管理
      path: '/agentaccountmanage',
      name: 'agentaccountmanage',
      component: agentaccountmanage
    },
    {
      //领取兑换记录
      path: '/consumerecord',
      name: 'consumerecord',
      component: consumerecord
    },
    {
      //对账预警
      path: '/accountCheck',
      name: 'accountCheck',
      component: accountCheck
    },
    {
      path: '/AgentList',
      name: 'AgentList',
      component: AgentList
    },
    {
      path: '/RefereeList',
      name: 'RefereeList',
      component: RefereeList
    },
    {
      //网吧列表
      path: '/NetBarList1',
      name: 'NetBarList1',
      component: NetBarList1
    },
    {
      //网吧列表
      path: '/NetManagement',
      name: 'NetManagement',
      component: NetManagement
    },
    {
      //网吧信息管理
      path: '/InformationManagement',
      name: 'InformationManagement',
      component: InformationManagement
    },
    {
      //网吧离线记录
      path: '/OfflineRecordingofInternetCafe',
      name: 'OfflineRecordingofInternetCafe',
      component: OfflineRecordingofInternetCafe
    },
    {
      //网吧状态管理
      path: '/StateStatistics',
      name: 'StateStatistics',
      component: StateStatistics
    },
    {
      //客户端版本管理
      path: '/VersionManagement',
      name: 'VersionManagement',
      component: VersionManagement
    },
    {
      //网吧版本日志
      path: '/VersionLog',
      name: 'VersionLog',
      component: VersionLog
    },
    {
      //网吧主页增值管理
      path: '/InternetBarAppreciation',
      name: 'InternetBarAppreciation',
      component: InternetBarAppreciation
    },
    {
      //网吧主页增值设置
      path: '/ValueAddedSettings',
      name: 'ValueAddedSettings',
      component: ValueAddedSettings
    },
    {
      //网吧领取兑换统计
      path: '/ExchangeStatistics',
      name: 'ExchangeStatistics',
      component: ExchangeStatistics
    },
    {
      //代理商管理
      path: '/CollectionRecords',
      name: 'CollectionRecords',
      component: CollectionRecords
    },
    {
      //活动统计
      path: '/ActivityStatistics',
      name: 'ActivityStatistics',
      component: ActivityStatistics
    },
    {
      //奖品设置
      path: '/PrizeSetting',
      name: 'PrizeSetting',
      component: PrizeSetting
    },
    {
      //赚取灵石统计
      path: '/LingshiStatistics',
      name: 'LingshiStatistics',
      component: LingshiStatistics
    },
    {
      //赚取任务设置
      path: '/TaskSettings',
      name: 'TaskSettings',
      component: TaskSettings
    },
    {
      //游戏竞猜统计
      path: '/QuizStatistics',
      name: 'QuizStatistics',
      component: QuizStatistics
    },
    {
      //竞猜模式设置
      path: '/QuizMode',
      name: 'QuizMode',
      component: QuizMode
    },
    {
      //竞猜订单管理
      path: '/CompetitiveOrder',
      name: 'CompetitiveOrder',
      component: CompetitiveOrder
    },
    {
      //绝地求生积分排行设置
      path: '/PUBGrankingsettings',
      name: 'PUBGrankingsettings',
      component: PUBGrankingsettings
    },
    {
      //战绩排名统计
      path: '/StatisticsofAchievements',
      name: 'StatisticsofAchievements',
      component: StatisticsofAchievements
    },
    {
      //区域战绩排名设置
      path: '/RankingRegionalAchievements',
      name: 'RankingRegionalAchievements',
      component: RankingRegionalAchievements
    },
    {
      //总榜战绩排名管理
      path: '/TopRankManagement',
      name: 'TopRankManagement',
      component: TopRankManagement
    },
    {
      //比赛领奖管理
      path: '/CompetitionAwardManagement',
      name: 'CompetitionAwardManagement',
      component: CompetitionAwardManagement
    },
    {
      //用户信息管理
      path: '/UserInformation',
      name: 'UserInformation',
      component: UserInformation
    },
    {
      //用户消息管理
      path: '/UserMessageManagement',
      name: 'UserMessageManagement',
      component: UserMessageManagement
    },
    {
      //用户登陆日志
      path: '/UserLoginog',
      name: 'UserLoginog',
      component: UserLoginog
    },
    {
      //意见反馈
      path: '/Feedback',
      name: 'Feedback',
      component: Feedback
    },
    {
      //灵石管理
      path: '/LingshiManagement',
      name: 'LingshiManagement',
      component: LingshiManagement
    },
    {
      //积分抽奖设置
      path: '/LuckyDraw',
      name: 'LuckyDraw',
      component: LuckyDraw
    },
    {
      //积分抽奖记录
      path: '/LuckyList',
      name: 'LuckyList',
      component: LuckyList
    },
    {
      //网吧支付记录
      path: '/PaymentRecord',
      name: 'PaymentRecord',
      component: PaymentRecord
    },
    {
      //网吧账单
      path: '/InternetCafebill',
      name: 'InternetCafebill',
      component: InternetCafebill
    },
    {
      //业务统计
      path: '/BarBill',
      name: 'BarBill',
      component: BarBill
    },
    {
      path: '/dlsGetBill',
      name: 'dlsGetBill',
      component: dlsGetBill
    },
    {
      path: '/TerminalTotal',
      name: 'TerminalTotal',
      component: TerminalTotal
    },
    {
      path: '/dlsBillDetail',
      name: 'dlsBillDetail',
      component: dlsBillDetail
    },
    {
      path: '/dlsCostBill',
      name: 'dlsCostBill',
      component: dlsCostBill
    },
    {
      path: '/Terminaldaily',
      name: 'Terminaldaily',
      component: Terminaldaily
    },

    {
      //代理商登陆日志
      path: '/ReginLog1',
      name: 'ReginLog1',
      component: ReginLog1
    },
    {
      //财务相关
      path: '/yjSet',
      name: 'yjSet',
      component: yjSet
    },
    {
      path: '/czManner',
      name: 'czManner',
      component: czManner
    },
    {
      path: '/cpxsTotal',
      name: 'cpxsTotal',
      component: cpxsTotal
    },
    {
      path: '/dlsyuer',
      name: 'dlsyuer',
      component: dlsyuer
    },
    {
      path: '/tixianManner',
      name: 'tixianManner',
      component: tixianManner
    },
    {
      path: '/dzyjManner',
      name: 'dzyjManner',
      component: dzyjManner
    },
    {
      //业务功能设置
      path: '/zhiruBannerSet',
      name: 'zhiruBannerSet',
      component: zhiruBannerSet
    },
    {
      path: '/sfzbSet',
      name: 'sfzbSet',
      component: sfzbSet
    },
    {
      path: '/zhuyeSet',
      name: 'zhuyeSet',
      component: zhuyeSet
    },
    {
      path: '/AgentNews',
      name: 'AgentNews',
      component: AgentNews
    },
    {
      path: '/InternetbarNews',
      name: 'InternetbarNews',
      component: InternetbarNews
    },
    {
      path: '/NavigationConfiguration',
      name: 'NavigationConfiguration',
      component: NavigationConfiguration
    },
    {
      path: '/steamtime',
      name: 'steamtime',
      component: steamtime
    },
    {
      path: '/steamorder',
      name: 'steamorder',
      component: steamorder
    },
    {
      path: '/GameInventory',
      name: 'GameInventory',
      component: GameInventory
    },
    {
      // 按桌标名称的点击量统计
      path: '/totalStatistics',
      name: 'totalStatistics',
      component: totalStatistics
    },
    {
      // 每日点击量统计
      path: '/dayStatistics',
      name: 'dayStatistics',
      component: dayStatistics
    },


  ]
})
