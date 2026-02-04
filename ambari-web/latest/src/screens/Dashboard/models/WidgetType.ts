/**
 * Widget type definition for the dashboard
 */
export interface WidgetType {
  id: string;
  name: string;
  displayName: string;
  iconPath: any; // Using 'any' to support both string paths and imported images
  description: string;
  properties: WidgetTypeProperty[];
}

/**
 * Property definition for widget types
 */
export interface WidgetTypeProperty {
  name: string;
  isRequired: boolean;
  value?: string;
  placeholder?: string;
  smallValue?: string;
  bigValue?: string;
  MAX_VALUE?: number;
}

// Import widget images
import widgetGaugeImg from "../../../assets/img/widget-gauge.png";
import widgetGraphImg from "../../../assets/img/widget-graph.png";
import widgetNumberImg from "../../../assets/img/widget-number.png";
import widgetTemplateImg from "../../../assets/img/widget-template.png";

/**
 * Available widget types with their properties
 */
export const widgetTypes: WidgetType[] = [
  {
    id: 'GAUGE',
    name: 'GAUGE',
    displayName: 'Gauge',
    iconPath: widgetGaugeImg,
    description: 'Displays a percentage value as a gauge/dial visualization.',
    properties: [
      {
        name: 'threshold',
        isRequired: false,
        smallValue: '0.7',
        bigValue: '0.9'
      }
    ]
  },
  {
    id: 'NUMBER',
    name: 'NUMBER',
    displayName: 'Number',
    iconPath: widgetNumberImg,
    description: 'Displays a single numeric value with optional thresholds and unit.',
    properties: [
      {
        name: 'threshold',
        isRequired: false,
        smallValue: '10',
        bigValue: '20',
        MAX_VALUE: Infinity
      },
      {
        name: 'display_unit',
        isRequired: false,
        value: '',
        placeholder: 'Optional: MB, ms, etc.'
      }
    ]
  },
  {
    id: 'GRAPH',
    name: 'GRAPH',
    displayName: 'Graph',
    iconPath: widgetGraphImg,
    description: 'Displays metrics as a line or area graph over time.',
    properties: [
      {
        name: 'graph_type',
        isRequired: true,
        value: 'LINE'
      },
      {
        name: 'display_unit',
        isRequired: false,
        value: '',
        placeholder: 'Optional: MB, ms, etc.'
      }
    ]
  },
  {
    id: 'TEMPLATE',
    name: 'TEMPLATE',
    displayName: 'Template',
    iconPath: widgetTemplateImg,
    description: 'Displays custom content using a template.',
    properties: []
  }
];

/**
 * Get widget type by ID
 */
export const getWidgetTypeById = (id: string): WidgetType | undefined => {
  return widgetTypes.find(type => type.id === id);
};

/**
 * Get widget type for a widget based on its view name
 */
export const getWidgetTypeForWidget = (viewName: any): WidgetType | undefined => {
  // Map view component names to widget types
  if (typeof viewName === 'string') {
    if (viewName.includes('Gauge') || viewName.includes('Pie')) {
      return getWidgetTypeById('GAUGE');
    } else if (viewName.includes('Chart') || viewName.includes('Graph')) {
      return getWidgetTypeById('GRAPH');
    } else if (viewName.includes('Number') || viewName.includes('Up') || viewName.includes('Uptime')) {
      return getWidgetTypeById('NUMBER');
    } else if (viewName.includes('Links') || viewName.includes('View')) {
      return getWidgetTypeById('TEMPLATE');
    }
  } else {
    // For React components, try to determine type from component name
    const componentName = viewName?.type?.name || '';
    if (componentName.includes('Gauge') || componentName.includes('Pie') || componentName.includes('Capacity')) {
      return getWidgetTypeById('GAUGE');
    } else if (componentName.includes('Chart') || componentName.includes('Graph')) {
      return getWidgetTypeById('GRAPH');
    } else if (componentName.includes('Number') || componentName.includes('Up') || componentName.includes('Uptime') || 
               componentName.includes('Load') || componentName.includes('Heap') || componentName.includes('Rpc')) {
      return getWidgetTypeById('NUMBER');
    } else if (componentName.includes('Links') || componentName.includes('View')) {
      return getWidgetTypeById('TEMPLATE');
    }
  }
  
  // Default to TEMPLATE if no match found
  return getWidgetTypeById('TEMPLATE');
};
