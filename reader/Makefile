marked_opts=--gfm

all: about.html api.html index.html toc

toc: index.md about.md api.md
	doctoc .

index.html: index.md
	marked ${marked_opts} -o index.html index.md

about.html: about.md
	marked ${marked_opts} -o about.html about.md

api.html: api.md
	marked ${marked_opts} -o api.html api.md

commit: about.html api.html
	git commit -m 'New build' about.html about.md api.html api.md

deploy: commit
	git push
