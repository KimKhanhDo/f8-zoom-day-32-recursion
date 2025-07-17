(function myFolderTreeApp() {
    const ICONS = {
        css: './icons/css.svg',
        ttf: './icons/font.svg',
        git: './icons/git.svg',
        html: './icons/html.svg',
        img: './icons/image.svg',
        js: './icons/javascript.svg',
        json: './icons/json.svg',
        md: './icons/markdown.svg',
        jsx: './icons/react.svg',
    };

    const DEFAULT_ICON = './icons/default-file.svg';

    const tree = [
        {
            type: 'folder',
            name: 'src',
            children: [
                {
                    type: 'folder',
                    name: 'components',
                    children: [
                        { type: 'file', name: 'Header.jsx' },
                        { type: 'file', name: 'Footer.jsx' },
                    ],
                },
                { type: 'file', name: 'index.js' },
            ],
        },
        {
            type: 'folder',
            name: 'public',
            children: [
                {
                    type: 'folder',
                    name: 'images',
                    children: [
                        { type: 'file', name: 'image.img' },
                        { type: 'file', name: 'icon.img' },
                        { type: 'file', name: 'avatar.img' },
                        { type: 'file', name: 'brand.img' },
                    ],
                },
            ],
        },
        {
            type: 'folder',
            name: 'styles',
            children: [
                { type: 'file', name: 'reset.css' },
                { type: 'file', name: 'style.css' },
            ],
        },
        {
            type: 'folder',
            name: 'hooks',
            children: [
                { type: 'file', name: 'useAuth.jsx' },
                { type: 'file', name: 'useFetch.jsx' },
            ],
        },
        {
            type: 'folder',
            name: 'fonts',
            children: [
                { type: 'file', name: 'Poppins.ttf' },
                { type: 'file', name: 'Roboto.ttf' },
            ],
        },
        {
            type: 'folder',
            name: 'pages',
            children: [
                { type: 'file', name: 'index.html' },
                { type: 'file', name: 'shopping.html' },
            ],
        },
        {
            type: 'folder',
            name: 'lib',
            children: [
                { type: 'file', name: 'mockData.json' },
                { type: 'file', name: 'userList.json' },
                { type: 'file', name: 'config.json' },
            ],
        },
        {
            type: 'folder',
            name: 'data',
            children: [],
        },
        {
            type: 'folder',
            name: 'tests',
            children: [],
        },
        {
            type: 'folder',
            name: 'empty_folder',
            children: [],
        },
        { type: 'file', name: 'README.md' },
        { type: 'file', name: 'package.json' },
        { type: 'file', name: '.gitignore' },
    ];

    const treeContainer = document.querySelector('.tree');
    const fileExplorer = document.querySelector('.file-explorer');
    const contextMenu = document.querySelector('.context-menu');
    let currentNode = null;

    fileExplorer.addEventListener('contextmenu', handleContextMenu);

    document.addEventListener('click', removeContextMenu);

    document.addEventListener('contextmenu', (e) => e.preventDefault());

    contextMenu.addEventListener('click', (e) => {
        const isRename = e.target.closest('.context-menu-rename');
        const isDelete = e.target.closest('.context-menu-delete');

        if (isRename) {
            handleInlineRename();
            return;
        }

        if (isDelete) {
            handleDeleteItem();
        }
    });

    for (const node of tree) {
        const li = createTreeNode(node);
        treeContainer.append(li);
    }

    // Create file/folder
    function createFolderNode(folderName) {
        const li = document.createElement('li');
        li.className = 'tree-item folder collapsed';

        const div = document.createElement('div');
        div.className = 'tree-item-content';

        // Create arrow icon
        const arrow = document.createElement('img');
        arrow.className = 'icon icon-arrow';
        arrow.src = 'icons/arrow.svg';

        // Create folder icon
        const folder = document.createElement('img');
        folder.className = 'icon icon-folder';
        folder.src = './icons/folder.svg';

        // Create folder's label
        const label = document.createElement('span');
        label.className = 'item-label';
        label.textContent = folderName;

        div.append(arrow, folder, label);
        li.appendChild(div);

        div.addEventListener('click', (e) => {
            toggleFolder(li);
            clearActiveState();
            div.classList.add('active');
        });

        return li;
    }

    function createFileNode(fileName) {
        const li = document.createElement('li');
        li.className = 'tree-item file';

        const div = document.createElement('div');
        div.className = 'tree-item-content';

        // Create indent
        const indent = document.createElement('span');
        indent.className = 'icon ';

        // Create file icon
        const file = document.createElement('img');
        file.className = 'icon icon-file';
        file.src = getFileIcon(fileName);

        // Create file's label
        const label = document.createElement('span');
        label.className = 'item-label';
        label.textContent = fileName;

        div.append(indent, file, label);
        li.appendChild(div);

        div.addEventListener('click', (e) => {
            clearActiveState();
            div.classList.add('active');
        });

        return li;
    }

    // Recursion tree node
    function createTreeNode(node) {
        if (node.type === 'folder') {
            // Create parent folder li
            const li = createFolderNode(node.name);

            // If that node has children
            if (node.children && node.children.length > 0) {
                // Create a sub ul
                const subUl = document.createElement('ul');

                // For each child, use createTreeNode(child) to receive a child li
                // append each child li to ul
                for (const child of node.children) {
                    const childLi = createTreeNode(child); // createTreeNode return a li
                    subUl.append(childLi);
                }

                // When sub ul append enough li -> append sub ul with parent li
                li.append(subUl);
            }

            return li;
        }

        if (node.type === 'file') {
            // Create li file & return
            const li = createFileNode(node.name);
            return li;
        }
    }

    // Handle Event Functions
    function handleContextMenu(e) {
        e.preventDefault();
        const treeNode = e.target.closest('.tree-item-content');

        if (!treeNode) {
            contextMenu.classList.remove('show');
            return;
        }

        currentNode = treeNode;

        contextMenu.style.left = e.clientX + 'px';
        contextMenu.style.top = e.clientY + 'px';
        contextMenu.classList.add('show');
    }

    function removeContextMenu(e) {
        const isContextMenu = e.target.closest('.context-menu');

        if (!isContextMenu) {
            contextMenu.classList.remove('show');
        }
    }

    function handleDeleteItem() {
        contextMenu.classList.remove('show');

        const answer = confirm(
            `Are you sure you want to delete "${currentNode.textContent}"?`
        );

        if (!answer) return;

        const nodeToDelete = currentNode.closest('li');
        nodeToDelete.remove();
    }

    function handleInlineRename() {
        contextMenu.classList.remove('show');
        console.log(currentNode);

        let labelElement = currentNode.querySelector('.item-label');
        let currentName = currentNode.textContent;
        labelElement.hidden = true;

        const inputStyle = {
            outline: 'none',
            background: 'transparent',
            padding: '2px 5px',
            border: '1px solid #606069',
            color: '#d4d4d4',
            fontSize: '16px',
            fontFamily: 'inherit',
        };
        let tempInput = document.createElement('input');
        tempInput.value = currentName;
        Object.assign(tempInput.style, inputStyle);

        labelElement.insertAdjacentElement('afterend', tempInput);
        tempInput.focus();

        // Apply closure
        let isRename = false;

        function renameHandler() {
            if (isRename) return;
            isRename = true;

            if (tempInput.value && tempInput.value !== currentName) {
                labelElement.textContent = tempInput.value;
            } else {
                labelElement.textContent = currentName;
            }

            // remove input out of node '.tree-item-content' - parentNode
            tempInput.remove();
            labelElement.hidden = false;
        }

        tempInput.addEventListener('blur', renameHandler);
        tempInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') renameHandler();
        });
    }

    function getFileIcon(fileName) {
        const iconName = fileName.split('.').pop();

        if (iconName.includes('git')) {
            return ICONS['git'];
        } else {
            return ICONS[iconName] || DEFAULT_ICON;
        }
    }

    function toggleFolder(element) {
        const isCollapsed = element.classList.contains('collapsed');
        const folder = element.querySelector('.icon-folder');

        if (isCollapsed) {
            element.classList.remove('collapsed');
            element.classList.add('expanded');
            folder.src = './icons/folder-open.svg';
        } else {
            element.classList.remove('expanded');
            element.classList.add('collapsed');
            folder.src = './icons/folder.svg';
        }
    }

    function clearActiveState() {
        const treeNodes = document.querySelectorAll('.tree-item-content');
        treeNodes.forEach((node) => node.classList.remove('active'));
    }
})();
