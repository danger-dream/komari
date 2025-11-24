import React from 'react'
import { useNodeDetails } from '@/contexts/NodeDetailsContext'
import { useTranslation } from 'react-i18next'
import Selector from './Selector'
import Flag from './Flag'
import { Badge, Flex } from '@radix-ui/themes'

interface NodeSelectorProps {
	className?: string
	hiddenDescription?: boolean
	value: string[] // uuid 列表
	onChange: (uuids: string[]) => void
	hiddenUuidOnlyClient?: boolean
	maxHeight?: string | number
	enableGroup?: boolean
	ungroupedLabel?: React.ReactNode
	showViewModeToggle?: boolean
	defaultViewMode?: 'list' | 'group'
}

const NodeSelector: React.FC<NodeSelectorProps> = ({
	className = '',
	hiddenDescription = false,
	value,
	onChange,
	hiddenUuidOnlyClient = false,
	maxHeight,
	enableGroup = false,
	ungroupedLabel,
	showViewModeToggle = false,
	defaultViewMode = 'list'
}) => {
	const { nodeDetail, isLoading, error } = useNodeDetails()
	const { t } = useTranslation()
	let nodesFiltered = value
	if (hiddenUuidOnlyClient) {
		nodesFiltered = nodesFiltered.filter(node => nodeDetail.find(n => n.uuid === node && !n.is_only_client))
	}
	if (isLoading) return <div>Loading...</div>
	if (error) return <div>{error}</div>

	return (
		<Selector
			className={className}
			hiddenDescription={hiddenDescription}
			value={nodesFiltered}
			onChange={onChange}
			items={[...nodeDetail]}
			sortItems={(a, b) => (a.weight ?? 0) - (b.weight ?? 0)}
			getId={n => n.uuid}
			getLabel={n => (
				<Flex align="center" gap="2" className="w-full">
					<Flag flag={n.region ?? ''} size="4" />
					<span className="flex-1 truncate">{n.name}</span>
					{n.group && enableGroup && (
						<Badge size="1" variant="surface" color="gray">
							{n.group}
						</Badge>
					)}
				</Flex>
			)}
			searchPlaceholder={t('common.search')}
			headerLabel={t('common.server')}
			maxHeight={maxHeight}
			groupBy={enableGroup ? n => n.group?.trim() || '' : undefined}
			ungroupedLabel={ungroupedLabel}
			viewModeSwitch={showViewModeToggle && enableGroup}
			defaultViewMode={defaultViewMode ?? (enableGroup ? 'group' : 'list')}
			viewModeLabels={{
				list: t('admin.nodeTable.view.list', '列表'),
				group: t('admin.nodeTable.view.group', '分组')
			}}
		/>
	)
}

export default NodeSelector
