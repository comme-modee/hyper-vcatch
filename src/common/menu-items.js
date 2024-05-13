const ADMIN_MENU_ITEMS = [
	{
		key: 'dashboards',
		label: '대시보드',
		isTitle: false,
		icon: 'uil-home-alt',
		url: '/dashboard'
	},
	{
		key: 'user-account',
		label: '계정',
		isTitle: false,
		icon: 'ri-account-circle-line',
		children: [
			{
				key: 'ac-status',
				label: '계정 현황',
				url: '/user-account/status',
				parentKey: 'user-account',
			},
			{
				key: 'ac-edit',
				label: '계정 정보 변경',
				url: '/user-account/edit',
				parentKey: 'user-account',
			},
			{
				key: 'ac-usage-period',
				label: '사용 기간 관리',
				url: '/user-account/usage-period',
				parentKey: 'user-account',
			}
		],
	},
	{
		key: 'monitoring',
		label: '모니터링',
		isTitle: false,
		icon: 'ri-computer-line',
		children: [
			{
				key: 'mo-keyword-week',
				label: '키워드 관리 - 주간',
				url: '/monitoring/keyword-week',
				parentKey: 'monitoring',
			},
			{
				key: 'mo-keyword-24hour',
				label: '키워드 관리 - 24시간',
				url: '/monitoring/keyword-24hour',
				parentKey: 'monitoring',
			},
			{
				key: 'mo-keyword-month',
				label: '키워드 관리 - 월간',
				url: '/monitoring/keyword-month',
				parentKey: 'monitoring',
			},
			{
				key: 'mo-report',
				label: '보고서 마법사',
				url: '/monitoring/report',
				parentKey: 'monitoring',
			},
			{
				key: 'mo-client',
				label: '클라이언트 목록 관리',
				url: '/monitoring/client',
				parentKey: 'monitoring'
			},
			{
				key: 'mo-keyword',
				label: '키워드 목록 관리',
				url: '/monitoring/keyword',
				parentKey: 'monitoring'
			}
		],
	},
	{
		key: 'blog',
		label: '블로그',
		isTitle: false,
		icon: 'mdi mdi-alpha-b-circle-outline',
		children: [
			{
				key: 'blog-visitor',
				label: '방문자',
				url: '/blog/visitor',
				parentKey: 'blog',
			},
			{
				key: 'blog-traffic',
				label: '트래픽',
				url: '/blog/traffic',
				parentKey: 'blog',
			}
		],
	},
	{
		key: 'admin',
		label: '관리자',
		isTitle: false,
		icon: 'ri-settings-3-line',
		children: [
			{
				key: 'admin-member',
				label: '클라이언트 권한 설정',
				url: '/admin/member',
				parentKey: 'admin',
			}
		],
	}
];

const EMPL_MENU_ITEMS = [
	{
		key: 'dashboards',
		label: '대시보드',
		isTitle: false,
		icon: 'uil-home-alt',
		url: '/dashboard'
	},
	{
		key: 'user-account',
		label: '계정',
		isTitle: false,
		icon: 'ri-account-circle-line',
		children: [
			{
				key: 'ac-status',
				label: '계정 현황',
				url: '/user-account/status',
				parentKey: 'user-account',
			},
			{
				key: 'ac-edit',
				label: '계정 정보 변경',
				url: '/user-account/edit',
				parentKey: 'user-account',
			},
			{
				key: 'ac-usage-period',
				label: '사용 기간 관리',
				url: '/user-account/usage-period',
				parentKey: 'user-account',
			}
		],
	},
	{
		key: 'monitoring',
		label: '모니터링',
		isTitle: false,
		icon: 'ri-computer-line',
		children: [
			{
				key: 'mo-keyword-week',
				label: '키워드 관리 - 주간',
				url: '/monitoring/keyword-week',
				parentKey: 'monitoring',
			},
			{
				key: 'mo-keyword-24hour',
				label: '키워드 관리 - 24시간',
				url: '/monitoring/keyword-24hour',
				parentKey: 'monitoring',
			},
			{
				key: 'mo-keyword-month',
				label: '키워드 관리 - 월간',
				url: '/monitoring/keyword-month',
				parentKey: 'monitoring',
			},
			{
				key: 'mo-report',
				label: '보고서 마법사',
				url: '/monitoring/report',
				parentKey: 'monitoring',
			},
			{
				key: 'mo-client',
				label: '클라이언트 목록 관리',
				url: '/monitoring/client',
				parentKey: 'monitoring'
			},
			{
				key: 'mo-keyword',
				label: '키워드 목록 관리',
				url: '/monitoring/keyword',
				parentKey: 'monitoring'
			}
		],
	},
	{
		key: 'blog',
		label: '블로그',
		isTitle: false,
		icon: 'mdi mdi-alpha-b-circle-outline',
		children: [
			{
				key: 'blog-visitor',
				label: '방문자',
				url: '/blog/visitor',
				parentKey: 'blog',
			},
			{
				key: 'blog-traffic',
				label: '트래픽',
				url: '/blog/traffic',
				parentKey: 'blog',
			}
		],
	}
];

const CLIENT_MENU_ITEMS = [
	{
		key: 'dashboards',
		label: '대시보드',
		isTitle: false,
		icon: 'uil-home-alt',
		url: '/dashboard'
	},
	{
		key: 'user-account',
		label: '계정',
		isTitle: false,
		icon: 'ri-account-circle-line',
		children: [
			{
				key: 'ac-status',
				label: '계정 현황',
				url: '/user-account/status',
				parentKey: 'user-account',
			},
			{
				key: 'ac-edit',
				label: '계정 정보 변경',
				url: '/user-account/edit',
				parentKey: 'user-account',
			},
			{
				key: 'ac-usage-period',
				label: '사용 기간 관리',
				url: '/user-account/usage-period',
				parentKey: 'user-account',
			}
		],
	},
	{
		key: 'monitoring',
		label: '모니터링',
		isTitle: false,
		icon: 'ri-computer-line',
		children: [
			{
				key: 'mo-keyword-week',
				label: '키워드 관리 - 주간',
				url: '/monitoring/keyword-week',
				parentKey: 'monitoring',
			},
			{
				key: 'mo-keyword-24hour',
				label: '키워드 관리 - 24시간',
				url: '/monitoring/keyword-24hour',
				parentKey: 'monitoring',
			},
			{
				key: 'mo-keyword-month',
				label: '키워드 관리 - 월간',
				url: '/monitoring/keyword-month',
				parentKey: 'monitoring',
			},
			{
				key: 'mo-report',
				label: '보고서 마법사',
				url: '/monitoring/report',
				parentKey: 'monitoring',
			},
			{
				key: 'mo-client',
				label: '클라이언트 목록 관리',
				url: '/monitoring/client',
				parentKey: 'monitoring'
			},
			{
				key: 'mo-keyword',
				label: '키워드 목록 관리',
				url: '/monitoring/keyword',
				parentKey: 'monitoring'
			}
		],
	}
];

export { ADMIN_MENU_ITEMS, CLIENT_MENU_ITEMS , EMPL_MENU_ITEMS };
