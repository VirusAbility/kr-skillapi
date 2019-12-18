/**
 * Represents the data for a dynamic skill
 *
 * @param {string} name - the name of the skill
 *
 * @constructor
 */
function Skill(name)
{
	this.components = [];

	// Included to simplify code when adding components
	this.html = document.getElementById('builderContent');
	
	this.dataKey = 'attributes';
	this.componentKey = 'components';
	
	// Skill data
	this.data = [
		new StringValue('이름', 'name', name).setTooltip('스킬의 이름입니다. 색상코드를 포함할 수 없습니다.'),
		new StringValue('종류', 'type', 'Dynamic').setTooltip('AOE에서 쓰이는 사용을 적어주십시오 ex) 액티브, 패시브'),
		new IntValue('최대 레벨', 'max-level', 5).setTooltip('스킬의 최고 레벨을 설정해 주세요'),
		new ListValue('필요 스킬', 'skill-req', ['None'], 'None').setTooltip('스킬을 배우기전 필수로 익혀야 하는 스킬을 설정합니다'),
		new IntValue('필요 스킬 레벨제한', 'skill-req-lvl', 1).setTooltip('익혀야 하는 스킬을 몇 레벨까지 올려야 하는지 설정합니다'),
		new ListValue('권한', 'needs-permission', ['True', 'False'], 'False').setTooltip('스킬을 배우려면 특정 펄미션이 필요할때 입력합니다.펄미션은 "skillapi.skill.{skillName}"처럼 입력해야 합니다.'),
		new AttributeValue('레벨제한', 'level', 1, 0).setTooltip('스킬을 배우거나 업그레이드 할때 필요한 레벨입니다.'),
		new AttributeValue('스킬포인트 소모', 'cost', 1, 0).setTooltip('스킬을 업그레이드 할때 소모될 스킬포인트 입니다.'),
		new AttributeValue('쿨타임', 'cooldown', 0, 0).setTooltip('스킬을 사용한 후 기다려야할 쿨타임 입니다.'),
		new AttributeValue('마나 소모', 'mana', 0, 0).setTooltip('스킬을 사용했을때 소모될 마나량 입니다.'),
		new AttributeValue('필요 스킬포인트', 'points-spent-req', 0, 0).setTooltip('스킬을 업그레이드 하기전 필요한 스킬포인트 입니다.'),
		new StringValue('캐스팅 메세지', 'msg', '&6{player} &2has cast &6{skill}').setTooltip('콘피그에서 설정한 범위안에 있는 플레이어에게 메세지를 보여줍니다.'),
        new StringValue('스킬 콤보', 'combo', '').setTooltip('콘피그에서 콤보를 활성화 했을때 사용가능합니다. 클릭으로 스킬을 사용할 수 있습니다. L, R, S, LS, RS, P, 와 Q 를 사용할 수 있고 구분은 스페이스로 합니다. 예제) "L L R R" -> 이러면 좌좌우우 를 누르면 스킬이 써집니다. '),
        new ListValue('아이콘 그래픽', 'indicator', [ '2D', '3D', 'None' ], '2D').setTooltip('[프리미엄] 스킬을 캐스팅할때 미리보기의 그래픽을 설정합니다.'),
		new ListValue('아이템', 'icon', getMaterials, 'Jack O Lantern').setTooltip('스킬트리에서 보일 아이템을 보입니다.'),
		new IntValue('아이템 부가 데이터', 'icon-data', 0).setTooltip('아이템의 부가데이터(내구도)를 설정합니다.'),
		new StringListValue('스킬 설명', 'icon-lore', [
			'&d{name} &7({level}/{max})',
			'&2Type: &6{type}',
			'',
			'{req:level}Level: {attr:level}',
			'{req:cost}Points: {attr:cost}',
			'',
			'&2Mana: {attr:mana}',
			'&2Cooldown: {attr:cooldown}'
		]).setTooltip('스킬창에서 스킬을 알아봤을때 볼 수 있는 설명입니다.'),
		new StringListValue('스킬 제한', 'incompatible', []).setTooltip('해당 스킬을 배우면 이 스킬을 배우지 못합니다.')
	];
}

/**
 * Applies the skill data to the HTML page, overwriting any previous data
 */ 
Skill.prototype.apply = function() 
{
	var builder = document.getElementById('builderContent');
	builder.innerHTML = '';
	
	// Set up the builder content
	for (var i = 0; i < this.components.length; i++)
	{
		this.components[i].createBuilderHTML(builder);
	}
}

/**
 * Creates the form HTML for editing the skill and applies it to
 * the appropriate area on the page
 */
Skill.prototype.createFormHTML = function()
{
	var form = document.createElement('form');
	
	var header = document.createElement('h4');
	header.innerHTML = '스킬 세부 설정';
	form.appendChild(header);
	
    form.appendChild(document.createElement('hr'));
    form.appendChild(this.createEditButton(form));
    form.appendChild(document.createElement('hr'));
	
	this.data[3].list.splice(1, this.data[3].list.length - 1);
	for (var i = 0; i < skills.length; i++)
	{
		if (skills[i] != this) 
		{
			this.data[3].list.push(skills[i].data[0].value);
		}
	}
	for (var i = 0; i < this.data.length; i++)
	{
		this.data[i].createHTML(form);
	}
	
	var hr = document.createElement('hr');
	form.appendChild(hr);
	
	form.appendChild(this.createEditButton(form));
	
	var target = document.getElementById('skillForm');
	target.innerHTML = '';
	target.appendChild(form);
}

Skill.prototype.createEditButton = function(form) {
    var done = document.createElement('h5');
	done.className = 'doneButton';
	done.innerHTML = 'Edit Effects',
	done.skill = this;
	done.form = form;
	done.addEventListener('click', function(e) {
		this.skill.update();
		var list = document.getElementById('skillList');
		list[list.selectedIndex].text = this.skill.data[0].value;
		this.form.parentNode.removeChild(this.form);
		showSkillPage('builder');
	});
    return done;
}

/**
 * Updates the skill data from the details form if it exists
 */
Skill.prototype.update = function()
{
	var index;
	var list = document.getElementById('skillList');
	for (var i = 0; i < skills.length; i++)
	{
		if (skills[i] == this)
		{
			index = i;
			break;
		}
	}
	var prevName = this.data[0].value;
	for (var j = 0; j < this.data.length; j++)
	{
		this.data[j].update();
	}
	var newName = this.data[0].value;
	this.data[0].value = prevName;
	if (isSkillNameTaken(newName)) return;
	this.data[0].value = newName;
	list[index].text = this.data[0].value;
}

/**
 * Checks whether or not the skill is using a given trigger
 *
 * @param {string} trigger - name of the trigger to check
 *
 * @returns {boolean} true if using it, false otherwise
 */ 
Skill.prototype.usingTrigger = function(trigger)
{
	for (var i = 0; i < this.components.length; i++)
	{
		if (this.components[i].name == trigger) return true;
	}
	return false;
}

/**
 * Creates and returns a save string for the skill
 */ 
Skill.prototype.getSaveString = function()
{
	var saveString = '';
	
	saveString += this.data[0].value + ":\n";
	for (var i = 0; i < this.data.length; i++)
	{
		if (isAttribute(this.data[i])) continue;
		saveString += this.data[i].getSaveString('  ');
	}
	saveString += '  attributes:\n';
	for (var i = 0; i < this.data.length; i++)
	{
		if (isAttribute(this.data[i]))
		{
			saveString += this.data[i].getSaveString('    ');
		}
	}
	if (this.components.length > 0)
	{
		saveString += '  components:\n';
		saveIndex = 0;
		for (var i = 0; i < this.components.length; i++)
		{
			saveString += this.components[i].getSaveString('    ');
		}
	}
	return saveString;
}

function isAttribute(input) {
    return (input instanceof AttributeValue) || (input.key == 'incompatible');
}

/**
 * Loads skill data from the config lines stating at the given index
 *
 * @param {YAMLObject} data - the data to load
 *
 * @returns {Number} the index of the last line of data for this skill
 */
Skill.prototype.load = function(data)
{
	if (data.active || data.embed || data.passive)
	{
		// Load old skill config for conversion
	}
	else 
	{
		this.loadBase(data);
	}
}

Skill.prototype.loadBase = loadSection;

/**
 * Creates a new skill and switches the view to it
 *
 * @returns {Skill} the new skill
 */ 
function newSkill()
{
	var id = 1;
	while (isSkillNameTaken('Skill ' + id)) id++;
	
	activeSkill = addSkill('Skill ' + id);
	
	var list = document.getElementById('skillList');
	list.selectedIndex = list.length - 2;
	
	activeSkill.apply();
	activeSkill.createFormHTML();
	showSkillPage('skillForm');
	
	return activeSkill;
}

/**
 * Adds a skill to the editor without switching the view to it
 *
 * @param {string} name - the name of the skill to add
 *
 * @returns {Skill} the added skill
 */ 
function addSkill(name) 
{
	var skill = new Skill(name);
	skills.push(skill);
	
	var option = document.createElement('option');
	option.text = name;
	var list = document.getElementById('skillList');
	list.add(option, list.length - 1);
	
	return skill;
}

/**
 * Checks whether or not a skill name is currently taken
 *
 * @param {string} name - name to check for
 *
 * @returns {boolean} true if the name is taken, false otherwise
 */ 
function isSkillNameTaken(name)
{
	return getSkill(name) != null;
}

/**
 * Retrieves a skill by name
 *
 * @param {string} name - name of the skill to retrieve
 *
 * @returns {Skill} the skill with the given name or null if not found
 */
function getSkill(name)
{
	name = name.toLowerCase();
	for (var i = 0; i < skills.length; i++)
	{
		if (skills[i].data[0].value.toLowerCase() == name) return skills[i];
	}
	return null;
}


var activeSkill = new Skill('Skill 1');
var activeComponent = undefined;
var skills = [activeSkill];
activeSkill.createFormHTML();
showSkillPage('skillForm');
