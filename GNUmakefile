# Synchronet Baja Module Makefile (GNU make)

# Requires Baja v2.20+

# @format.tab-size 8, @format.use-tabs true

# $id: $

ifndef BAJAPATH
 BAJAPATH	:=	./baja
endif

all :	\
        cntnodes.bin \
        default.bin \
	dir.bin \
	file_io.bin \
        ftp.bin \
        getimlst.bin \
	html.bin \
	lbshell.bin \
	major.bin \
	matrix.bin \
	noyesbar.bin \
	pcboard.bin \
        qnet-ftp.bin \
	ra_emu.bin \
	renegade.bin \
	sdos.bin \
	simple.bin \
	type.bin \
	wildcat.bin \
	wwiv.bin \
	yesnobar.bin 

%.bin : %.src $(BAJAPATH)
	@$(BAJAPATH) /q $<
